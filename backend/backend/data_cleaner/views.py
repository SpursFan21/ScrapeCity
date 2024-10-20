# data_cleaner/views.py
import pandas as pd
from pandas import DataFrame
from bs4 import BeautifulSoup
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from scraping_engine.models import ScrapedData
from .models import CleanedData
from django.http import HttpResponse
import csv
import io
from rest_framework.exceptions import MethodNotAllowed
import json

'''
    # Check if the data has already been cleaned
    if CleanedData.objects.filter(order=scraped_data, user=request.user).exists():
        return Response({
            "detail": "This order has already been cleaned."
        }, status=status.HTTP_400_BAD_REQUEST)
    '''


@api_view(['POST'])
def clean_and_store_data(request, order_id):
    
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        # Fetch the order using the provided order_id
        order = ScrapedData.objects.get(order_id=order_id)
        user = request.user
        
        scraped_content = order.scraped_content
        
        # If scraped_content is in JSON format, convert it to a string to process with BeautifulSoup
        raw_html = json.dumps(scraped_content) if isinstance(scraped_content, dict) else scraped_content
        
        # Parse the raw HTML with BeautifulSoup
        soup = BeautifulSoup(raw_html, 'html.parser')
        
        # Remove unnecessary tags like <style>, <script>, <link>, <button>, etc.
        for tag in soup(["style", "script", "link", "button", "nav", "footer", "header"]):
            tag.decompose()

        # Extract meaningful content:
        meaningful_text = ""
        
        # Collect header tags (h1, h2, h3)
        for header in soup.find_all(['h1', 'h2', 'h3']):
            meaningful_text += f"{header.get_text().strip()}\n\n"  # Add headers with spacing
        
        # Collect paragraph tags
        for paragraph in soup.find_all('p'):
            meaningful_text += f"{paragraph.get_text().strip()}\n\n"
        
        # Collect list items (li)
        for list_item in soup.find_all('li'):
            meaningful_text += f"- {list_item.get_text().strip()}\n"

        # Add <a> links to keep valuable anchor text and URLs
        for link in soup.find_all('a'):
            href = link.get('href')
            text = link.get_text().strip()
            if href and text:
                meaningful_text += f"Link: {text} ({href})\n"

        # Store the cleaned data in the CleanedData model
        cleaned_data_entry = CleanedData.objects.create(
            user=user,
            order=order,
            cleaned_content={'text': meaningful_text},
            csv_generated=False
        )

        # Return a success response with the cleaned data
        return Response({
            'message': 'Data cleaned and stored successfully',
            'cleaned_order_id': cleaned_data_entry.cleaned_order_id,
            'cleaned_data': cleaned_data_entry.cleaned_content['text']
        }, status=status.HTTP_200_OK)

    except ScrapedData.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_cleaned_data(request, cleaned_order_id):

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

   
    if request.method != 'GET':
        raise MethodNotAllowed(method=request.method)  # This will return a 405 Method Not Allowed error

    # Fetch the cleaned data from the database using cleaned_order_id
    try:
        cleaned_data = get_object_or_404(CleanedData, cleaned_order_id=cleaned_order_id, user=request.user)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

    # Convert the cleaned data to a DataFrame for easy manipulation
    df = pd.DataFrame(cleaned_data.cleaned_content)

    # Check if the user requested CSV format via query parameter
    if request.GET.get('format') == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="cleaned_data_{cleaned_order_id}.csv"'

        # Write the DataFrame to the CSV
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)

        # Set the content of the response to the CSV data
        response.write(csv_buffer.getvalue())
        return response

    # Otherwise, return the data as JSON (default)
    return Response(cleaned_data.cleaned_content, status=status.HTTP_200_OK)