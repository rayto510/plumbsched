from django.urls import path
from .views import create_job, list_jobs, delete_job

urlpatterns = [
    path('jobs/', list_jobs, name='list_jobs'),
    path('jobs/create/', create_job, name='create_job'),
    path('jobs/<int:pk>/', delete_job, name='delete_job'),
]
