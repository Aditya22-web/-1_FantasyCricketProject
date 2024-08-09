import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css'; // Import the main CSS file for Tailwind styles
import PlayerInput from './components/PlayerInput';

function App() {
  const [playerList, setPlayerList] = useState([]);
  const [pitchDescription, setPitchDescription] = useState('');

  useEffect(() => {
    // Fetch and parse the CSV file
    console.log('Fetching CSV file...');
    fetch('/PlayersNames.csv')
      .then(response => {
        console.log('CSV file fetched, status:', response.status);
        return response.text();
      })
      .then(data => {
        console.log('CSV data received, length:', data.length);
        const players = data.split('\n').map(name => name.trim()).filter(name => name);
        console.log('Parsed player list, count:', players.length);
        setPlayerList(players);
      })
      .catch(error => console.error('Error loading player names:', error));
  }, []);

  useEffect(() => {
    console.log('playerList updated, count:', playerList.length);
  }, [playerList]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Fantasy Cricket App</h1>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">Welcome to Fantasy Cricket</h2>
        <p className="text-lg mb-4">
          Create your dream team and compete with other cricket enthusiasts!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(22)].map((_, index) => (
            <PlayerInput key={index} playerList={playerList} />
          ))}
        </div>
        <div className="mt-8">
          <label className="block text-lg font-medium mb-2" htmlFor="pitch-description">
            Pitch Description
          </label>
          <textarea
            id="pitch-description"
            value={pitchDescription}
            onChange={(e) => setPitchDescription(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full h-32"
            placeholder="Enter pitch description here..."
          />
        </div>
        <div className="mt-8">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </main>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2023 Fantasy Cricket App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
