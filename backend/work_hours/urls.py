from django.urls import path
from .views import WorkHourView

urlpatterns = [
    path("", WorkHourView.as_view()),
]
