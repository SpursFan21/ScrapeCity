from django.db import models
from django.contrib.auth.models import User
import uuid

class CleanedData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey('scraping_engine.ScrapedData', on_delete=models.CASCADE)
    cleaned_content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    cleaned_order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    csv_generated = models.BooleanField(default=False)
    csv_file_path = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"Cleaned Data for Order {self.cleaned_order_id}"
