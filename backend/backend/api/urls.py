# api/urls.py

from django.urls import path
from accounts.views import RegisterView, LoginView, VerifyTokenView, UpdateAccountView
from scraping_engine.views import scrape_view, ScrapingOrdersList, ScrapingOrderDetail

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    path('update-account/', UpdateAccountView.as_view(), name='update-account'),
    path('scrape/', scrape_view, name='scrape'),
    path('scraping-orders/', ScrapingOrdersList.as_view(), name='scraping-orders'),
    path('scraping-order/<int:order_id>/', ScrapingOrderDetail.as_view(), name='scraping-order-detail'),
]
