from django.urls import path
from .views import submit_pitch_report

urlpatterns = [
    path('submit_pitch_report/', submit_pitch_report, name='submit_pitch_report'),
]
