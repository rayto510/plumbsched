from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer

@api_view(['POST'])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_appointments(request):
    appointments = Appointment.objects.all().order_by('-scheduled_time')  # latest first
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_appointment_details(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

    appointment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT', 'PATCH'])
def update_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)  # partial=True allows PATCH
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)