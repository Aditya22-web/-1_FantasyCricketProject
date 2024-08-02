from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PitchReport
import json

# Create your views here.

def analyze_pitch_report(pitch_report_data, player_details):
    # Extract all pitch conditions
    pitch_type = pitch_report_data.get('pitch_type', '')
    weather_conditions = pitch_report_data.get('weather_conditions', '')
    soil_type = pitch_report_data.get('soil_type', '')
    grass_cover = pitch_report_data.get('grass_cover', '')
    dryness = pitch_report_data.get('dryness', '')
    cracks = pitch_report_data.get('cracks', '')
    bounce = pitch_report_data.get('bounce', '')
    turn = pitch_report_data.get('turn', '')
    seam_movement = pitch_report_data.get('seam_movement', '')
    moisture_levels = pitch_report_data.get('moisture_levels', '')

    # Initialize player categories
    batsmen = []
    fast_bowlers = []
    spin_bowlers = []
    all_rounders = []

    # Analyze conditions and suggest players
    if pitch_type == "dry" and cracks == "many":
        spin_bowlers.extend(["Spin Bowler A", "Spin Bowler B"])
        batsmen.extend(["Batsman A", "Batsman B", "Batsman C"])
    elif pitch_type == "green" and moisture_levels == "high":
        fast_bowlers.extend(["Fast Bowler A", "Fast Bowler B", "Fast Bowler C"])
        all_rounders.append("All-rounder A")
    elif bounce == "high" and soil_type == "hard":
        batsmen.extend(["Aggressive Batsman A", "Aggressive Batsman B"])
        fast_bowlers.append("Fast Bowler D")
    elif turn == "high" and dryness == "very dry":
        spin_bowlers.append("Spin Bowler C")
        batsmen.extend(["Defensive Batsman A", "Defensive Batsman B"])
    elif seam_movement == "high" and grass_cover == "heavy":
        fast_bowlers.extend(["Fast Bowler E", "Fast Bowler F"])
        all_rounders.append("All-rounder B")

    # Consider weather conditions
    if weather_conditions == "overcast":
        fast_bowlers.append("Swing Bowler A")
    elif weather_conditions == "sunny":
        batsmen.append("Aggressive Batsman C")

    # Ensure we have 11 players in total
    while len(batsmen) + len(fast_bowlers) + len(spin_bowlers) + len(all_rounders) < 11:
        if len(batsmen) < 6:
            batsmen.append(f"Batsman {len(batsmen) + 1}")
        elif len(fast_bowlers) < 4:
            fast_bowlers.append(f"Fast Bowler {len(fast_bowlers) + 1}")
        elif len(spin_bowlers) < 2:
            spin_bowlers.append(f"Spin Bowler {len(spin_bowlers) + 1}")
        else:
            all_rounders.append(f"All-rounder {len(all_rounders) + 1}")

    suggested_players = batsmen + fast_bowlers + spin_bowlers + all_rounders
    return suggested_players[:11]

@csrf_exempt
def submit_pitch_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            pitch_report_data = data.get('pitch_report', {})
            if isinstance(pitch_report_data, str):
                try:
                    pitch_report_data = json.loads(pitch_report_data)
                except json.JSONDecodeError:
                    return JsonResponse({'error': 'Invalid pitch report data'}, status=400)
            player_details = {k: v for k, v in data.items() if k.startswith('player_')}

            # Create a new PitchReport instance
            pitch_report = PitchReport.objects.create(
                pitch_type=pitch_report_data.get('pitch_type', ''),
                weather_conditions=pitch_report_data.get('weather_conditions', ''),
                soil_type=pitch_report_data.get('soil_type', ''),
                grass_cover=pitch_report_data.get('grass_cover', ''),
                dryness=pitch_report_data.get('dryness', ''),
                cracks=pitch_report_data.get('cracks', ''),
                bounce=pitch_report_data.get('bounce', ''),
                turn=pitch_report_data.get('turn', ''),
                seam_movement=pitch_report_data.get('seam_movement', ''),
                moisture_levels=pitch_report_data.get('moisture_levels', ''),
                additional_notes=pitch_report_data.get('additional_notes', '')
            )

            # Analyze the pitch report and get suggested players
            suggested_players = analyze_pitch_report(pitch_report_data, player_details)

            return JsonResponse({'suggested_players': suggested_players})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
