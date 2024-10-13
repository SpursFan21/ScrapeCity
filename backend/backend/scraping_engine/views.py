from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests
import os
from dotenv import load_dotenv
from .models import ScrapedData
from .serializers import ScrapedDataSerializer

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


class ScrapingOrderDetail(generics.RetrieveAPIView):
    serializer_class = ScrapedDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the order ID from the URL and return the specific order for the authenticated user
        order_id = self.kwargs['order_id']
        return generics.get_object_or_404(ScrapedData, order_id=order_id, user=self.request.user)
