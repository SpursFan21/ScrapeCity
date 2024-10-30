from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests
import os
from dotenv import load_dotenv
from .models import ScrapedData
from .serializers import ScrapedDataSerializer
import logging
from rest_framework.exceptions import NotFound

load_dotenv()

def validate_voucher(voucher_code):
    valid_voucher = os.getenv("VALID_VOUCHER_CODE")
    
    if voucher_code == valid_voucher:
        return True
    return False


@api_view(['POST'])
def scrape_view(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Get the voucher code from the request data
    voucher_code = request.data.get('voucher_code')
    if not voucher_code:
        return Response({"detail": "Voucher code is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate the voucher code
    if not validate_voucher(voucher_code):
        return Response({"detail": "Invalid voucher code."}, status=status.HTTP_400_BAD_REQUEST)

    # Voucher is valid, proceed with the scraping
    url = request.data.get('url')
    geo = request.data.get('geo', 'us')
    retry_num = request.data.get('retryNum', 1)

    if not url:
        return Response({"detail": "URL is required for scraping."}, status=status.HTTP_400_BAD_REQUEST)

    # Get Scrape Ninja URL and RapidAPI headers from environment
    SCRAPE_NINJA_URL = os.getenv('SCRAPE_NINJA_URL')
    RAPID_API_HOST = os.getenv('RAPID_API_HOST')
    RAPID_API_KEY = os.getenv('RAPID_API_KEY')

    if not SCRAPE_NINJA_URL or not RAPID_API_HOST or not RAPID_API_KEY:
        return Response({"detail": "API configuration error. Please check your environment variables."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    headers = {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY,
        'Content-Type': 'application/json'
    }

    # Call Scrape Ninja API to perform the scraping
    try:
        response = requests.post(SCRAPE_NINJA_URL, json={"url": url, "geo": geo, "retryNum": retry_num}, headers=headers)
    except requests.exceptions.RequestException as e:
        return Response({"detail": f"Error connecting to Scrape Ninja API: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

    if response.status_code == 200:
        scraped_data = response.json()

        # Store the scraped data in the database and associate it with the authenticated user
        ScrapedData.objects.create(
            user=request.user,
            url=url,
            geo=geo,
            retry_num=retry_num,
            scraped_content=scraped_data
        )

        return Response(scraped_data, status=status.HTTP_200_OK)

    return Response(response.json(), status=response.status_code)



class ScrapingOrdersList(generics.ListAPIView):
    serializer_class = ScrapedDataSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        # Return only the scraping orders for the authenticated user
        return ScrapedData.objects.filter(user=self.request.user)


# Set up logging
logger = logging.getLogger(__name__)

class ScrapingOrderDetail(generics.RetrieveAPIView):
    serializer_class = ScrapedDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        order_id = self.kwargs.get('order_id')
        user = self.request.user

        # Logging for debugging
        logger.info(f"Attempting to retrieve order with order_id: {order_id} for user: {user.id}, username: {user.username}")

        if not order_id:
            logger.error("No order_id provided in the URL.")
            raise NotFound(detail="Order ID is missing in the URL.", code=status.HTTP_400_BAD_REQUEST)

        if not user.is_authenticated:
            logger.error("User is not authenticated.")
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Fetch the order by `order_id`
            scraped_data = ScrapedData.objects.get(order_id=order_id, user=user)
            logger.info(f"Order {order_id} found for user {user.username}.")
            return scraped_data
        except ScrapedData.DoesNotExist:
            logger.warning(f"No order with order_id {order_id} found for user {user.username}.")
            raise NotFound(detail=f"Order with order_id {order_id} not found for the current user.", code=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            raise NotFound(detail="An unexpected error occurred while fetching the order.", code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        # Get the order object using the modified get_object method
        instance = self.get_object()

        # Log the raw data for debugging
        logger.info(f"Returning raw data: {instance.scraped_content}")

        # Serialize the instance (including raw data)
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ScrapingOrderBulkDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        order_ids = request.data.get('order_ids', [])
        user = request.user

        logger.info(f"Attempting to delete orders with IDs: {order_ids} for user: {user.id}, username: {user.username}")

        if not order_ids:
            return Response({"detail": "No order IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Delete the matching orders
        deleted_count, _ = ScrapedData.objects.filter(order_id__in=order_ids, user=user).delete()

        if deleted_count == 0:
            logger.warning(f"No orders found for provided IDs: {order_ids} for user {user.username}.")
            raise NotFound(detail="No matching orders found for deletion.", code=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Successfully deleted {deleted_count} orders for user {user.username}.")
        return Response({"detail": f"Successfully deleted {deleted_count} orders."}, status=status.HTTP_204_NO_CONTENT)
