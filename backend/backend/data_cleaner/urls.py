# data_cleaner/urls.py
from django.urls import path
from .views import get_cleaned_data, clean_and_store_data

urlpatterns = [
    path('api/clean-data/<uuid:order_id>/', clean_and_store_data, name='cleaned-data-store'),
    path('api/get-cleaned-data/<uuid:cleaned_order_id>/', get_cleaned_data, name='cleaned-data-get'),
]
