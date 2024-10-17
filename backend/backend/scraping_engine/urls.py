# scraping_engine/urls.py

from django.urls import path
from .views import scrape_view, ScrapingOrdersList, ScrapingOrderDetail

urlpatterns = [
    path('api/scrape/', scrape_view, name='scrape'),
    path('api/scraping-orders/', ScrapingOrdersList.as_view(), name='scraping-orders'),
    path('api/order-details/<uuid:order_id>/', ScrapingOrderDetail.as_view(), name='scraping-order-detail'),
]
