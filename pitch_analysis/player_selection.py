# player_selection.py

def select_best_players(pitch_report, player_statistics):
    """
    Function to select the best 11 players based on the pitch report and player statistics.
    :param pitch_report: Dictionary containing details of the pitch report
    :param player_statistics: List of dictionaries containing player statistics
    :return: List of the best 11 players
    """
    # Initialize lists to categorize players
    batsmen = []
    bowlers = []
    all_rounders = []
    wicketkeepers = []

    # Analyze player statistics and categorize players
    for player in player_statistics:
        role = player.get('role', '').lower()
        if 'bat' in role:
            batsmen.append(player)
        elif 'bowl' in role:
            bowlers.append(player)
        elif 'allrounder' in role:
            all_rounders.append(player)
        elif 'wicketkeeper' in role:
            wicketkeepers.append(player)

    # Analyze pitch report to determine pitch conditions
    pitch_conditions = pitch_report.get('conditions', '').lower()
    is_batting_friendly = 'batting' in pitch_conditions
    is_bowling_friendly = 'bowling' in pitch_conditions
    is_spin_friendly = 'spin' in pitch_conditions
    is_pace_friendly = 'pace' in pitch_conditions

    # Select players based on pitch conditions
    selected_players = []

    # Select batsmen
    if is_batting_friendly:
        selected_players.extend(sorted(batsmen, key=lambda x: x['batting_average'], reverse=True)[:5])
    else:
        selected_players.extend(sorted(batsmen, key=lambda x: x['batting_average'], reverse=True)[:4])

    # Select bowlers
    if is_bowling_friendly:
        if is_spin_friendly:
            selected_players.extend(sorted(bowlers, key=lambda x: x['bowling_average'], reverse=True)[:3])
        elif is_pace_friendly:
            selected_players.extend(sorted(bowlers, key=lambda x: x['bowling_average'], reverse=True)[:3])
        else:
            selected_players.extend(sorted(bowlers, key=lambda x: x['bowling_average'], reverse=True)[:2])
    else:
        selected_players.extend(sorted(bowlers, key=lambda x: x['bowling_average'], reverse=True)[:2])

    # Select all-rounders
    selected_players.extend(sorted(all_rounders, key=lambda x: (x['batting_average'] + x['bowling_average']) / 2, reverse=True)[:2])

    # Select wicketkeeper
    selected_players.extend(sorted(wicketkeepers, key=lambda x: x['batting_average'], reverse=True)[:1])

    # Ensure the team has 11 players
    while len(selected_players) < 11:
        if len(all_rounders) > 2:
            selected_players.append(all_rounders.pop(0))
        elif len(batsmen) > 5:
            selected_players.append(batsmen.pop(0))
        elif len(bowlers) > 3:
            selected_players.append(bowlers.pop(0))
        else:
            break

    return selected_players
