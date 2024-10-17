# scraping_engine/serializers.py
from rest_framework import serializers
from .models import ScrapedData

class ScrapedDataSerializer(serializers.ModelSerializer):
    raw_data = serializers.JSONField(source='scraped_content')

    class Meta:
        model = ScrapedData
        fields = ['order_id', 'url', 'geo', 'retry_num', 'created_at', 'raw_data']
