import React from 'react';
import './App.css';
import './index.css'; // Import the main CSS file for Tailwind styles

function App() {
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
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </main>
      
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2023 Fantasy Cricket App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
