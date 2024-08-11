import React from 'react';
import './App.css';
import PlayerSelectionForm from './components/PlayerSelectionForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cricket Player Selection</h1>
      </header>
      <main>
        <PlayerSelectionForm />
      </main>
    </div>
  );
}

export default App;
