# accounts/views.py

from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
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
                "refresh": str(refresh),  # return the refresh token
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=401)

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for simplicity (use only in development)
class VerifyTokenView(View):
    def post(self, request):
        token = request.headers.get('Authorization')  # Get the token from the Authorization header
        
        if token is None:
            return JsonResponse({"error": "No token provided"}, status=401)
        
        # Remove "Bearer " prefix if present
        token = token.split(" ")[1] if " " in token else token
        
        try:
            # Use JWT Authentication to validate the token
            validated_token = JWTAuthentication().get_validated_token(token)

            # Retrieve user information based on user_id from the token
            user_id = validated_token["user_id"]
            user = User.objects.get(id=user_id)

            # Convert the validated token to a dictionary
            response_data = {
                "message": "Token is valid",
                "decoded": {
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "exp": validated_token["exp"],
                    "iat": validated_token["iat"],
                }
            }
            return JsonResponse(response_data, status=200)
        except TokenError:
            return JsonResponse({"error": "Token is invalid or expired"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        

@method_decorator(csrf_exempt, name='dispatch')
class UpdateAccountView(View):
    def put(self, request):
    
        token = request.headers.get('Authorization')
        
        if token is None:
            return JsonResponse({"error": "No token provided"}, status=401)
        
        token = token.split(" ")[1] if " " in token else token
        
        try:
            # Validate the token
            validated_token = JWTAuthentication().get_validated_token(token)
            
            # Retrieve user information from the token
            user_id = validated_token["user_id"]
            user = User.objects.get(id=user_id)
            
            # Get updated data from the request body
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            # Update user fields if new values are provided
            if username:
                user.username = username
            if email:
                user.email = email
            if password:
                user.set_password(password)
                
            user.save()

            return JsonResponse({
                "message": "User details updated successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                }
            }, status=200)
        
        except TokenError:
            return JsonResponse({"error": "Token is invalid or expired"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
