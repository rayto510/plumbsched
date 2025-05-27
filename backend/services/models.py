from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Service(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=255)
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return self.name
