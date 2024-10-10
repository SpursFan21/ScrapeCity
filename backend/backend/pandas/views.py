# pandas/views.py
import pandas as pd
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

# 1. Clean and store the data
@api_view(['POST'])
def clean_and_store_data(request, order_id):

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch the raw scraped data for the order
    scraped_data = get_object_or_404(ScrapedData, order_id=order_id, user=request.user)

    raw_data = scraped_data.scraped_content

    # Function to clean HTML and remove JS, CSS
    def clean_html(html_content):
        soup = BeautifulSoup(html_content, "html.parser")

        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        # Get plain text and strip unnecessary whitespace
        text = soup.get_text(separator=" ")
        cleaned_text = ' '.join(text.split())
        return cleaned_text

    # Clean each piece of raw data
    cleaned_data_list = []
    for data_item in raw_data:
        if isinstance(data_item, dict):
            cleaned_item = {key: clean_html(value) if isinstance(value, str) else value for key, value in data_item.items()}
            cleaned_data_list.append(cleaned_item)
        elif isinstance(data_item, str):
            cleaned_data_list.append(clean_html(data_item))
        else:
            cleaned_data_list.append(data_item)

    # Convert cleaned data to Pandas DataFrame and further process
    df = pd.DataFrame(cleaned_data_list)
    cleaned_df = df.dropna()

    # Convert DataFrame back to list of dictionaries for storing
    cleaned_data = cleaned_df.to_dict(orient='records')

    # Save cleaned data to database
    cleaned_data_entry = CleanedData.objects.create(
        user=request.user,
        order=scraped_data,
        cleaned_content=cleaned_data
    )

    return Response({"detail": "Data cleaned and stored successfully."}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_cleaned_data(request, order_id):

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch the cleaned data from the database
    cleaned_data = get_object_or_404(CleanedData, order_id=order_id, user=request.user)

    # Convert the cleaned data to a DataFrame for easy manipulation
    df = pd.DataFrame(cleaned_data.cleaned_content)

    # Check if the user requested CSV format via query parameter
    if request.GET.get('format') == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="cleaned_data_{order_id}.csv"'

        # Write the DataFrame to the CSV
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)

        # Set the content of the response to the CSV data
        response.write(csv_buffer.getvalue())
        return response

    # Otherwise, return the data as JSON (default)
    return Response(cleaned_data.cleaned_content, status=status.HTTP_200_OK)
