import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Textarea,
  Button,
  Heading,
  Text,
  Container,
  Alert,
  AlertIcon,
  Spinner,
  Input,
} from '@chakra-ui/react';
import Autosuggest from 'react-autosuggest';

// Sample list of cricketer names (you should replace this with a more comprehensive list)
const cricketers = [
  'Virat Kohli', 'Rohit Sharma', 'Steve Smith', 'Kane Williamson', 'Joe Root',
  'Ben Stokes', 'Jasprit Bumrah', 'Pat Cummins', 'Babar Azam', 'Kagiso Rabada'
];

// Autosuggest functions
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : cricketers.filter(cricketer =>
    cricketer.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

function App() {
  const [players, setPlayers] = useState(Array(22).fill(''));
  const [pitchReport, setPitchReport] = useState({
    spin_friendly: 0.5,
    pace_friendly: 0.5,
    batting_friendly: 0.5,
    bounce: 0.5,
    moisture: 0.5
  });
  const [suggestions, setSuggestions] = useState(Array(22).fill([]));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handlePlayerChange = (index, newValue) => {
    const newPlayers = [...players];
    newPlayers[index] = newValue;
    setPlayers(newPlayers);
  };

  const onSuggestionsFetchRequested = async ({ value }, index) => {
    try {
      const response = await fetch(`http://localhost:5002/autocomplete?q=${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      const newSuggestions = [...suggestions];
      newSuggestions[index] = data;
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const onSuggestionsClearRequested = (index) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index] = [];
    setSuggestions(newSuggestions);
  };

  const handlePitchReportChange = (e) => {
    const { name, value } = e.target;
    setPitchReport(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit function called');
    console.log('Current players:', players);
    console.log('Current pitch report:', pitchReport);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5002/suggest_players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitch_report: pitchReport,
          player_names: players.filter(player => player.trim() !== ''),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze pitch');
      }

      const data = await response.json();
      if (!Array.isArray(data.best_11)) {
        console.warn('best_11 is not an array in the API response');
        data.best_11 = [];
      }
      setResult(data);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputProps = (index) => ({
    placeholder: `Enter player ${index + 1} name`,
    value: players[index],
    onChange: (_, { newValue }) => handlePlayerChange(index, newValue)
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">Cricket Pitch Analyzer</Heading>

        <Box width="100%">
          <Heading as="h2" size="lg" mb={4}>Player Names</Heading>
          <VStack spacing={4}>
            {players.map((_, index) => (
              <HStack key={index} width="100%">
                <Text width="100px">Player {index + 1}:</Text>
                <Autosuggest
                  suggestions={suggestions[index]}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, index)}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested(index)}
                  getSuggestionValue={(suggestion) => suggestion}
                  renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                  inputProps={inputProps(index)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box width="100%">
          <Heading as="h2" size="lg" mb={4}>Pitch Report</Heading>
          <VStack spacing={4}>
            {Object.entries(pitchReport).map(([key, value]) => (
              <HStack key={key} width="100%">
                <Text width="150px">{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Input
                  type="number"
                  name={key}
                  value={value}
                  onChange={handlePitchReportChange}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button colorScheme="blue" size="lg" onClick={handleSubmit} isLoading={isLoading}>
          Submit
        </Button>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {result && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={2}>Analysis Result</Heading>
            <Text>Best 11 players: {result.best_11.join(', ')}</Text>
            <Text>Captain: {result.captain}</Text>
            <Text>Vice-captain: {result.vice_captain}</Text>
          </Box>
        )}

        {isLoading && <Spinner size="xl" />}
      </VStack>
    </Container>
  );
}

export default App;
