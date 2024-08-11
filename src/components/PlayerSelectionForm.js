import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Textarea, VStack, SimpleGrid, useToast } from '@chakra-ui/react';
import Autocomplete from './Autocomplete';

const PlayerSelectionForm = () => {
  const [players, setPlayers] = useState(Array(22).fill(''));
  const [pitchReport, setPitchReport] = useState('');
  const [cricketerNames, setCricketerNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.cricapi.com/v1/players?apikey=09b024ce-6303-4f42-b6a6-170487c7dd52&offset=0');
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        if (data.status !== "success") {
          throw new Error('API returned unsuccessful status');
        }
        const names = data.data.map(player => `${player.name} (${player.country})`);
        setCricketerNames(names);
      } catch (error) {
        console.error('Error fetching player data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load player data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [toast]);

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (players.some(player => player.trim() === '') || pitchReport.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // TODO: Handle form submission
    console.log('Form submitted', { players, pitchReport });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4} align="stretch">
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
          {players.map((player, index) => (
            <FormControl key={index} isRequired>
              <FormLabel>Player {index + 1}</FormLabel>
              <Autocomplete
                suggestions={cricketerNames}
                onSearchChange={(event) => handlePlayerChange(index, event.target.value)}
                searchTerm={player}
                onSuggestionClick={(suggestion) => handlePlayerChange(index, suggestion)}
                placeholder={`Enter player ${index + 1} name`}
                isLoading={isLoading}
              />
            </FormControl>
          ))}
        </SimpleGrid>
        <FormControl isRequired>
          <FormLabel>Pitch Report</FormLabel>
          <Textarea
            value={pitchReport}
            onChange={(e) => setPitchReport(e.target.value)}
            placeholder="Enter pitch report description"
            rows={4}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default PlayerSelectionForm;
