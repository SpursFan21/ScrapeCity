# pandas/urls.py
from django.urls import path
from .views import get_cleaned_data, clean_and_store_data

urlpatterns = [
    path('cleaned-data/<uuid:order_id>/', clean_and_store_data, name='cleaned-data-store'),
    path('cleaned-data/<uuid:order_id>/download-csv/', get_cleaned_data, name='cleaned-data-get'),
]
