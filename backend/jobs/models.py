from django.db import models

# Create your models here.
class Job(models.Model):
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    address = models.TextField()
    description = models.TextField(blank=True)
    scheduled_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Job for {self.customer_name} at {self.address}"