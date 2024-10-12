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

    # Fetch the raw scraped data for the order
    scraped_data = get_object_or_404(ScrapedData, order_id=order_id, user=request.user)

    raw_data = scraped_data.scraped_content
    print("Raw Data:", raw_data)
    if not raw_data:
        print("Raw data is empty!")
        return Response({"detail": "No raw data found."}, status=status.HTTP_404_NOT_FOUND)

    # Function to clean HTML and remove JS, CSS
    def clean_html(html_content):
        print("HTML Content to Clean:", html_content)  # Debugging statement
        soup = BeautifulSoup(html_content, "html.parser")

        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        # Get plain text and strip unnecessary whitespace
        text = soup.get_text(separator=" ")
        cleaned_text = ' '.join(text.split())
        print("Cleaned Text after initial cleaning:", cleaned_text)  # After initial cleaning

        # Remove excess spaces (more than 2)
        cleaned_text = ' '.join(part for part in cleaned_text.split(' ') if len(part) > 2)
        print("Cleaned Text after removing excess spaces:", cleaned_text)  # After removing excess spaces
        
        return cleaned_text.strip()  # Return cleaned text with leading/trailing spaces removed

    # Clean each piece of raw data and collect cleaned text
    cleaned_data = []
    for index, data_item in enumerate(raw_data):
        print(f"Data Item {index}:", data_item)  # Log each data item
        if isinstance(data_item, dict):
            for key, value in data_item.items():
                if isinstance(value, str):
                    cleaned_text = clean_html(value)  # Clean and print for string items
                    if cleaned_text:
                        cleaned_data.append(cleaned_text)  # Append cleaned text to the list
                else:
                    print(f"Non-string data at index {index}, key '{key}': {value}")
        elif isinstance(data_item, str):
            cleaned_text = clean_html(data_item)  # Clean and print for string items
            if cleaned_text:
                cleaned_data.append(cleaned_text)  # Append cleaned text to the list

    # Combine all cleaned text into a single string
    final_cleaned_data = ' '.join(cleaned_data).strip()
    print("Final Cleaned Data:", final_cleaned_data)
    if not final_cleaned_data:
        print("Final cleaned data is empty!")
        return Response({"detail": "No cleaned data found."}, status=status.HTTP_404_NOT_FOUND)

    # Save cleaned data to database
    cleaned_data_entry = CleanedData.objects.create(
        user=request.user,
        order=scraped_data,
        cleaned_content=final_cleaned_data  # Store the cleaned data string
    )

    # Include cleaned_order_id and cleaned_data_id in the response
    return Response({
        "detail": "Data cleaned and stored successfully.",
        "cleaned_order_id": str(cleaned_data_entry.cleaned_order_id),
        "cleaned_data_id": cleaned_data_entry.id  # Return the cleaned_data_id
    }, status=status.HTTP_201_CREATED)


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