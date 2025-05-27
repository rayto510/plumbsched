from rest_framework import serializers
from .models import WorkHour

class WorkHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkHour
        fields = ["id", "day", "start_time", "end_time"]
