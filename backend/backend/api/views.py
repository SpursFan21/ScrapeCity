from django.shortcuts import render

# api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    data = {'message': 'Hello, world!'}
    return Response(data)
