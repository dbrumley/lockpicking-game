import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  useDisclosure,
  Heading,
  Center,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';
import Leaderboard from '../components/Leaderboard';
import Stopwatch from '../components/Stopwatch';
import GameOver from '../components/GameOver';
import LockList from "../components/LockList";
import io from 'socket.io-client';
import { useSound } from 'use-sound';
import { Player } from '../../../types/Player'; // Assuming this is the correct path to your shared types
import Lockboard, { SolvedBoard } from '../../../types/Lockboard';

import audioFile from '../../sounds/videogame-death-sound.mp3'; // Replace with your audio file path

const SOCKET_SERVER_URL = 'http://localhost:3000';

function LockboardPage() {
  const [gameActive, setGameActive] = useState(false);
  const [boards, setBoards] = useState<Lockboard[]>([]); // Define the correct type for your boards
  const [leaders, setLeaders] = useState<Player[]>([]);
  const [playGameOverSound] = useSound(audioFile);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const socketRef = useRef(null);


  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    // Setup socket event listeners
    // ... (socket event listeners)

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Socket event listeners
    const socket = socketRef.current;

    socket.on('currentState', (locks, isGameActive, serverLeaders) => {
      setBoards(locks);
      setGameActive(isGameActive);
      setLeaders(serverLeaders);
      console.log("Current state: ", locks, serverLeaders);
    });

    socket.on('updateLocks', (locks) => {
      setBoards(locks);
    });

    socket.on('gameStarted', () => {
      setGameActive(true);
    });

    socket.on('gameEnded', () => {
      setGameActive(false);
      playGameOverSound();
      onOpen();
    });

    socket.on('updateLeaderboard', (serverLeaders) => {
      console.log('leaders', serverLeaders);
      setLeaders(serverLeaders);
    });


    // Cleanup function to remove event listeners
    return () => {
      socket.off('currentState');
      socket.off('updateLocks');
      socket.off('updateLeaderboard');
      socket.off('gameStarted');
      socket.off('gameEnded');
    };
  }, [onOpen, playGameOverSound]);

  function handleTimerEnd() {
    console.log('handleTimerEnd: ', gameActive);
    setGameActive(false);
    socketRef.current?.emit('endGame');
    playGameOverSound(); // Play the audio when the game is over
    onOpen();
  }

  function handleStartStop() {
    if (!gameActive) {
      console.log("Sending startGame");
      socketRef.current?.emit('startGame', gameActive);
      setGameActive(true);
    } else {
      console.log("Sending endGame");
      socketRef.current?.emit('endGame');
      setGameActive(false);
    }
  }

  function handleReset() {
    setGameActive(false);
    socketRef.current?.emit('clearGame');
  }

  function handleSave(solvedBoards: SolvedBoard[]) {
    console.log("handleSave", solvedBoards);
    socketRef.current?.emit('saveCompetition', solvedBoards);
    onClose();
  }

  return (
    <Box>
      <Center margin="center">
        <Heading textColor="#fff" fontSize="80px">Lockpicking Challenge</Heading>
      </Center>
      <SimpleGrid columns={3} padding="16px" spacing={16}>
        <GridItem colSpan={1} bg="gray.50" borderRadius='xl' padding="8">
          <Stopwatch
            gameActive={gameActive}
            handleTimerEnd={handleTimerEnd}
            handleStartStop={handleStartStop}
            handleReset={handleReset} />
          <GameOver
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            boards={boards}
          />
        </GridItem>
        <GridItem colSpan={2} bg="gray.50" borderRadius='xl' padding="8">
          <LockList boards={boards} />
        </GridItem>
        <GridItem colSpan={3} bg="gray.50" borderRadius='xl' padding='8'>
          <Leaderboard data={leaders} />
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

export default LockboardPage;
