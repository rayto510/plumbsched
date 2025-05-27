from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import WorkHour
from .serializers import WorkHourSerializer
from django.db import transaction

class WorkHourView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hours = WorkHour.objects.filter(user=request.user)
        serializer = WorkHourSerializer(hours, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data  # Expecting dict with keys for each day
        with transaction.atomic():
            WorkHour.objects.filter(user=request.user).delete()
            entries = []
            for day, times in data.items():
                if len(times) != 2:
                    continue
                entries.append(WorkHour(
                    user=request.user,
                    day=day,
                    start_time=times[0],
                    end_time=times[1]
                ))
            WorkHour.objects.bulk_create(entries)
        return Response({"status": "updated"}, status=201)

    def delete(self, request):
        deleted_count, _ = WorkHour.objects.filter(user=request.user).delete()
        if deleted_count == 0:
            return Response({"detail": "No work hours to delete."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)