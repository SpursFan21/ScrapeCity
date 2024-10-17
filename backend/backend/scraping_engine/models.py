# scraping_engine/models.py
from django.db import models
from django.contrib.auth.models import User
import uuid

class ScrapedData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField()
    geo = models.CharField(max_length=10)
    retry_num = models.IntegerField()
    scraped_content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)  # Unique order ID

    def __str__(self):
        return f"Data from {self.url} ({self.geo}) for {self.user.username} - Order ID: {self.order_id}"
