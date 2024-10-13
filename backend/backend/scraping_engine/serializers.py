# scraping_engine/serializers.py
from rest_framework import serializers
from .models import ScrapedData

class ScrapedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedData
        fields = ['order_id', 'url', 'geo', 'retry_num', 'created_at']  # Add order_id here
