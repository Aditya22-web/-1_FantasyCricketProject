from django.db import models

# Create your models here.
class PitchReport(models.Model):
    pitch_type = models.CharField(max_length=100)
    weather_conditions = models.CharField(max_length=100)
    soil_type = models.CharField(max_length=100)
    grass_cover = models.CharField(max_length=100)
    dryness = models.CharField(max_length=100)
    cracks = models.CharField(max_length=100)
    bounce = models.CharField(max_length=100)
    turn = models.CharField(max_length=100)
    seam_movement = models.CharField(max_length=100)
    moisture_levels = models.CharField(max_length=100)
    additional_notes = models.TextField()

    def __str__(self):
        return f"Pitch Report: {self.pitch_type}, {self.weather_conditions}"
