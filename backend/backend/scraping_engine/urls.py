# scraping_engine/urls.py

from django.urls import path
from .views import scrape_view, ScrapingOrdersList, ScrapingOrderDetail

urlpatterns = [
    path('scrape/', scrape_view, name='scrape'),
    path('api/scraping-orders/', ScrapingOrdersList.as_view(), name='scraping-orders'),
    path('api/scraping-order/<int:order_id>/', ScrapingOrderDetail.as_view(), name='scraping-order-detail'),
]
