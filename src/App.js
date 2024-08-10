import React, { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page or contact support.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [players, setPlayers] = useState([]);
  const [playerDetails, setPlayerDetails] = useState(Array(22).fill({ name: '', id: '' }));
  const [pitchReport, setPitchReport] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);

  const debouncedSuggestionsCallback = useCallback((value, index) => {
    if (value.trim() === '') {
      setSuggestions([]);
      setActiveIndex(null);
      return;
    }

    if (!Array.isArray(players) || players.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const matchedPlayers = players
        .filter(player => player && typeof player.name === 'string' && player.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);

      setSuggestions(matchedPlayers.length > 0 ? matchedPlayers : [{ name: 'No matches found' }]);
      setActiveIndex(index);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([{ name: 'Error generating suggestions' }]);
    }
  }, [players]);

  const debouncedSuggestions = useMemo(
    () => debounce(debouncedSuggestionsCallback, 300),
    [debouncedSuggestionsCallback]
  );

useEffect(() => {
  const fetchAndParseCSV = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching CSV file...');
      const response = await fetch('/PlayersNames.csv', {
        headers: {
          'Accept': 'text/csv; charset=UTF-8'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      console.log('Received content type:', contentType);

      if (!contentType || !contentType.includes('text/csv')) {
        throw new Error(`Expected CSV but received ${contentType}`);
      }

      let csv = await response.text();

      console.log('CSV data fetched. Size:', csv.length, 'bytes');
      console.log('First 100 characters:', csv.substring(0, 100));

      processPlayerData(csv);
    } catch (error) {
      console.error('Error loading or parsing CSV:', error);
      setPlayers([]);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processPlayerData = (csv) => {
    try {
      const players = csv.split('\n').map(name => name.trim()).filter(name => name !== '');
      console.log('CSV parsed. Total players:', players.length);
      console.log('First 5 player names:', players.slice(0, 5));

      const playerNames = players.map(name => ({ name }));

      console.log('Total players after processing:', playerNames.length);
      console.log('First 5 processed player names:', playerNames.slice(0, 5));

      if (playerNames.length === 0) {
        throw new Error('No valid player names found after processing');
      }

      setPlayers(playerNames);
      console.log('Players state updated successfully. Total players:', playerNames.length);
    } catch (error) {
      console.error('Error processing player data:', error);
      setError(error.message);
    }
  };

  fetchAndParseCSV();

  return () => {
    // Cleanup function if needed
  };
}, []);

  if (isLoading) {
    return <div>Loading player data...</div>;
  }

  if (error) {
    return <div>Error: {error}. Please refresh the page or contact support.</div>;
  }

  // Removed redundant useEffect for logging players state changes

  const handleInputChange = (index, field, value) => {
    try {
      console.log(`handleInputChange called: index=${index}, field=${field}, value=${value}`);
      setPlayerDetails(prevDetails => {
        const newDetails = [...prevDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        console.log(`Updated playerDetails for index ${index}:`, newDetails[index]);
        return newDetails;
      });

      if (field === 'name') {
        if (value.trim() !== '') {
          console.log(`Calling debouncedSuggestions for value: "${value}" at index ${index}`);
          debouncedSuggestions(value, index);
        } else {
          console.log('Empty input, clearing suggestions');
          setSuggestions([]);
          setActiveIndex(null);
        }
      } else {
        console.log(`Non-name field "${field}" updated, clearing suggestions`);
        setSuggestions([]);
        setActiveIndex(null);
      }
    } catch (error) {
      console.error('Error in handleInputChange:', error);
      setSuggestions([]);
      setActiveIndex(null);
      // Use a more user-friendly error message
      alert('An error occurred while updating player details. Please try again or contact support if the issue persists.');
    }
  };

  const handleSuggestionClick = (index, name) => {
    const newPlayerDetails = [...playerDetails];
    newPlayerDetails[index] = { ...newPlayerDetails[index], name };
    setPlayerDetails(newPlayerDetails);
    setSuggestions([]);
    setActiveIndex(null);
  };

  const handleSubmit = () => {
    const data = {
      pitch_report: pitchReport,
      players: playerDetails.filter(player => player.name && player.id)
    };

    fetch('http://10.240.132.223:5000/submit_pitch_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Data submitted successfully!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while submitting data. Please try again.');
    });
  };



  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Fantasy Cricket App</h1>
        <p className="text-center mb-6">Welcome to the Fantasy Cricket App! Enter player details and pitch report below.</p>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerDetails.map((player, index) => (
                <div key={index} className="mb-4">
                  <div className="relative">
                    <input
                      className="w-full p-2 border rounded mb-2"
                      placeholder={`Player ${index + 1} Name`}
                      value={player.name}
                      onChange={(e) => {
                        console.log(`Input change for player ${index + 1}: ${e.target.value}`);
                        handleInputChange(index, 'name', e.target.value);
                      }}
                      onFocus={() => {
                        console.log(`Focus on player ${index + 1} input`);
                        setActiveIndex(index);
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setActiveIndex(null), 200);
                      }}
                      devin-id={`player-name-${index}`}
                    />
                    {activeIndex === index && (
                      <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                        {isLoading && (
                          <div className="p-2 text-gray-500">
                            Loading suggestions...
                          </div>
                        )}
                        {!isLoading && suggestions.length > 0 && (
                          <ul>
                            {suggestions.map((suggestion, i) => (
                              <li
                                key={i}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  console.log(`Suggestion selected for player ${index + 1}: ${suggestion.name}`);
                                  handleSuggestionClick(index, suggestion.name);
                                }}
                              >
                                {suggestion.name}
                              </li>
                            ))}
                          </ul>
                        )}
                        {!isLoading && suggestions.length === 0 && player.name.trim() !== '' && (
                          <div className="p-2 text-gray-500">
                            No matches found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    className="w-full p-2 border rounded"
                    placeholder={`Player ${index + 1} ID`}
                    value={player.id}
                    onChange={(e) => {
                      console.log(`ID change for player ${index + 1}: ${e.target.value}`);
                      handleInputChange(index, 'id', e.target.value);
                    }}
                    devin-id={`player-id-${index}`}
                  />
                </div>
              ))}
            </div>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Pitch Report"
              value={pitchReport}
              onChange={(e) => {
                console.log(`Pitch report updated: ${e.target.value}`);
                setPitchReport(e.target.value);
              }}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => {
                console.log('Submit button clicked');
                handleSubmit();
              }}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
