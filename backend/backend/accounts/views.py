# accounts/views.py

from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
import json

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for simplicity (use only in development)
class RegisterView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        return JsonResponse({"message": "User registered successfully"}, status=201)

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for simplicity (use only in development)
class LoginView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log the user in
            refresh = RefreshToken.for_user(user)  # Create a token for the user
            return JsonResponse({
                "message": "User logged in successfully",
                "access": str(refresh.access_token),  # Return the access token
                "refresh": str(refresh),  # Optionally return the refresh token
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=401)
