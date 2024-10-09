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

    # Call Scrape Ninja API to perform the scraping
    response = requests.post("https://api.scrape.ninja/scrape", json={"url": url, "geo": geo, "retryNum": retry_num})

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
