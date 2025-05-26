from django.urls import path
from .views import create_appointment, list_appointments, delete_appointment, update_appointment, get_appointment_details

urlpatterns = [
    path('appointments/', list_appointments, name='list_appointments'),
    path('appointments/create/', create_appointment, name='create_appointment'),
    path('appointments/<int:pk>/', delete_appointment, name='delete_appointment'),
    path('appointments/<int:pk>/update/', update_appointment, name='update_appointment'),
    path('appointments/<int:pk>/details/', get_appointment_details, name='get_appointment_details'),
]
