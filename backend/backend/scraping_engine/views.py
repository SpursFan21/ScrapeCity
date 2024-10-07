# views.py
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests
from .models import ScrapedData
from .serializers import ScrapedDataSerializer


@api_view(['POST'])
def scrape_view(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    url = request.data.get('url')
    geo = request.data.get('geo')
    retry_num = request.data.get('retryNum', 1)

    # Call Scrape Ninja API
    response = requests.post("https://api.scrape.ninja/scrape", json={"url": url, "geo": geo, "retryNum": retry_num})

    if response.status_code == 200:
        scraped_data = response.json()
        
        # Store scraped data in the database associated with the user
        ScrapedData.objects.create(
            user=request.user,  # Associate with the authenticated user
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
        # Get the order ID from the URL
        order_id = self.kwargs['order_id']
        # Return the specific order for the authenticated user
        return generics.get_object_or_404(ScrapedData, order_id=order_id, user=self.request.user)
