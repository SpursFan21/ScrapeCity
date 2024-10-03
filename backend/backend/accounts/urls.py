# accounts/urls.py

from django.urls import path
from .views import RegisterView, LoginView, VerifyTokenView, UpdateAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('update-account/', UpdateAccountView.as_view(), name='update_account'),
]
