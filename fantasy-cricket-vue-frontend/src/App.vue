<template>
  <div id="app">
    <h1>Fantasy Cricket App</h1>
    <div class="player-inputs">
      <div v-for="n in 22" :key="n" class="player-input">
        <label :for="'player' + n">Player {{ n }} Name:</label>
        <input :id="'player' + n" v-model="players[n-1].name" type="text" :placeholder="'Enter Player ' + n + ' Name'">
        <label :for="'playerId' + n">Player {{ n }} ID:</label>
        <input :id="'playerId' + n" v-model="players[n-1].id" type="text" :placeholder="'Enter Player ' + n + ' ID'">
      </div>
    </div>
    <div class="pitch-report">
      <label for="pitchReport">Pitch Report:</label>
      <textarea id="pitchReport" v-model="pitchReport" placeholder="Enter pitch report details as JSON"></textarea>
    </div>
    <button @click="submitData">Submit</button>
    <div v-if="suggestedPlayers.length > 0" class="suggested-players">
      <h2>Suggested Players:</h2>
      <ul>
        <li v-for="player in suggestedPlayers" :key="player">{{ player }}</li>
      </ul>
    </div>
    <div v-if="captain" class="captain">
      <h2>Captain: {{ captain }}</h2>
    </div>
    <div v-if="viceCaptain" class="vice-captain">
      <h2>Vice-Captain: {{ viceCaptain }}</h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      players: Array(22).fill().map(() => ({ name: '', id: '' })),
      pitchReport: '',
      suggestedPlayers: [],
      captain: '',
      viceCaptain: ''
    }
  },
  methods: {
    async submitData() {
      try {
        let pitchReportObject;
        try {
          pitchReportObject = JSON.parse(this.pitchReport);
        } catch (error) {
          console.error('Error parsing pitch report:', error);
          alert('Please enter a valid JSON for the pitch report');
          return;
        }

        const formattedPlayers = this.players.filter(player => player.name && player.id);

        const response = await axios.post('http://10.240.132.223:5000/submit_pitch_report', {
          players: formattedPlayers,
          pitch_report: pitchReportObject
        });
        this.suggestedPlayers = response.data.suggested_players;
        this.captain = response.data.captain;
        this.viceCaptain = response.data.vice_captain;
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('An error occurred while submitting data. Please try again.');
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.player-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.player-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pitch-report {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.suggested-players, .captain, .vice-captain {
  margin-top: 20px;
}

.suggested-players ul {
  list-style-type: none;
  padding: 0;
}

.suggested-players li {
  margin: 5px 0;
}

.captain, .vice-captain {
  font-weight: bold;
  color: #4CAF50;
}
</style>
