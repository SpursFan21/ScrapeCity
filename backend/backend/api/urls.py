# api/urls.py

from django.urls import path
from accounts.views import RegisterView, LoginView, VerifyTokenView, UpdateAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    path('update-account/', UpdateAccountView.as_view(), name='update-account'),
]
