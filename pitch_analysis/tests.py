from django.test import TestCase, Client
from django.urls import reverse
from .models import PitchReport
from .views import analyze_pitch_report
import json

class PitchAnalysisTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_dry_pitch_with_cracks(self):
        data = {
            'pitch_type': 'dry',
            'weather_conditions': 'sunny',
            'soil_type': 'clay',
            'grass_cover': 'light',
            'dryness': 'very dry',
            'cracks': 'many',
            'bounce': 'low',
            'turn': 'high',
            'seam_movement': 'low',
            'moisture_levels': 'low',
            'additional_notes': 'Test case for dry pitch with cracks'
        }
        response = self.client.post(reverse('submit_pitch_report'), data=data)
        self.assertEqual(response.status_code, 200)
        suggested_players = json.loads(response.content)['suggested_players']
        self.assertEqual(len(suggested_players), 11)
        self.assertIn('Spin Bowler A', suggested_players)
        self.assertIn('Spin Bowler B', suggested_players)
        self.assertIn('Batsman A', suggested_players)

    def test_green_pitch_with_high_moisture(self):
        data = {
            'pitch_type': 'green',
            'weather_conditions': 'overcast',
            'soil_type': 'loam',
            'grass_cover': 'heavy',
            'dryness': 'moist',
            'cracks': 'none',
            'bounce': 'high',
            'turn': 'low',
            'seam_movement': 'high',
            'moisture_levels': 'high',
            'additional_notes': 'Test case for green pitch with high moisture'
        }
        response = self.client.post(reverse('submit_pitch_report'), data=data)
        self.assertEqual(response.status_code, 200)
        suggested_players = json.loads(response.content)['suggested_players']
        self.assertEqual(len(suggested_players), 11)
        self.assertIn('Fast Bowler A', suggested_players)
        self.assertIn('Fast Bowler B', suggested_players)
        self.assertIn('All-rounder A', suggested_players)
        self.assertIn('Swing Bowler A', suggested_players)

    def test_analyze_pitch_report_directly(self):
        pitch_report = PitchReport.objects.create(
            pitch_type='dry',
            weather_conditions='sunny',
            soil_type='hard',
            grass_cover='light',
            dryness='very dry',
            cracks='few',
            bounce='high',
            turn='medium',
            seam_movement='low',
            moisture_levels='low',
            additional_notes='Test case for direct analysis'
        )
        suggested_players = analyze_pitch_report(pitch_report)
        self.assertEqual(len(suggested_players), 11)
        self.assertIn('Aggressive Batsman A', suggested_players)
        self.assertIn('Aggressive Batsman B', suggested_players)
        self.assertIn('Fast Bowler D', suggested_players)
