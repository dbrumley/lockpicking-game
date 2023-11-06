import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  useDisclosure,
  Heading,
  Center,
  SimpleGrid,
  GridItem
} from '@chakra-ui/react';
import Lockboard from '../components/Lockboard';
import Leaderboard from '../components/Leaderboard';
import Stopwatch from '../components/Stopwatch';
import GameOver from '../components/GameOver';

import LockList from "../components/LockList";
import io from 'socket.io-client';
import { useSound } from 'use-sound';
import { Player, defaultData } from '../components/Player';
import { v4 as uuid } from 'uuid';


import audioFile from '../../sounds/videogame-death-sound.mp3'; // Replace with your audio file path

const SOCKET_SERVER_URL = 'http://localhost:3000';

interface Winner {
  place: number,
  player: string,
  solveTime: number,
  solveDate: Date,
};

//  id: string;
//name: string;
//bestSolveTime: number | undefined;
//bestSolveDate: string;


function LockboardPage() {

  const [gameActive, setGameActive] = useState<boolean>(false);
  const [boards, setBoards] = useState<Lockboard[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>(defaultData);

  const [playGameOverSound] = useSound(audioFile); // Initialize the useSound hook
  const { isOpen, onOpen, onClose } = useDisclosure();


  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);  // Empty dependency array ensures this useEffect runs only on mount and unmount.

  useEffect(() => {
    socketRef.current.on('initialLockStates', (lockstates: Lockboard[], currentGameState: boolean) => {
      setGameActive(currentGameState);
      console.log("States:", lockstates)
      setBoards(lockstates);
    });

    socketRef.current.on('lockStateChanged', (states: Lockboard[]) => {
      setBoards(states);
      console.log("Updated states", states)

    });

    socketRef.current.on('gameStarted', () => {
      console.log("gameStarted received");
      setGameActive(true);
    });

    socketRef.current.on('gameEnded', () => {
      console.log("gameEnded received");
      setGameActive(false); // This should already be true, but do it anyway.
      //setLockData(lockData.map(lock => ({ ...lock, solveTime: null })));
    });

    socketRef.current.on('gameCleared', () => {
      console.log('gameCleared recieved');
    })

  }, [boards]);

  const onSave = (board: Lockboard) => {
    const updatedBoards = boards.map((b: Lockboard) => {
      return b.id === board.id ? board : b;
    });
    setBoards(updatedBoards);
  };

  // Function to update the playerData state
  const updatePlayerData = (newWinners: Winner[]) => {
    setPlayerData((currentPlayerData) => {
      // Iterate over newWinners to update currentPlayerData
      const updatedPlayerData = currentPlayerData.map((player) => {
        // Find a matching winner for the current player
        const winner = newWinners.find(winner => winner.player === player.name);

        // If there's a winner and they have a better solve time, update the player data
        if (winner && (player.bestSolveTime === undefined || winner.solveTime < player.bestSolveTime)) {
          return { ...player, bestSolveTime: winner.solveTime, bestSolveDate: new Date().toISOString() };
        }
        // Otherwise, return the player data as is
        return player;
      });

      // Now, add new winners that aren't already in the player data
      newWinners.forEach((winner) => {
        if (!updatedPlayerData.some(player => player.name === winner.player)) {
          updatedPlayerData.push({
            id: uuid(),
            name: winner.player,
            bestSolveTime: winner.solveTime,
            bestSolveDate: new Date().toISOString(),
          });
        }
      });

      return updatedPlayerData;
    });
  };

  const setPlayerName = (index: number, name: string) => {
    // First, update the player name in the boards array.
    const newLockboards = boards.map((board, i) => {
      const updatedBoard = { ...board, player: name };
      return updatedBoard;
    });
    setBoards(newLockboards);

    // Then, sort the updated lockboards to determine the winners.
    const sorted = [...newLockboards] // Make sure to copy the array before sorting.
      .filter((board) => board.solved && typeof board.solveTime === 'number') // Filter out unsolved boards and ensure solveTime is a number.
      .sort((a, b) => a.solveTime - b.solveTime); // Sort by solveTime in ascending order.

    const currentDate = new Date();

    // Now map to the WinnerProps interface.
    const newWinners: Winner[] = sorted.map((board, i): Winner => ({
      place: i + 1,
      player: board.player ?? 'Unknown', // Use 'Unknown' or any fallback string if player is not set.
      solveTime: board.solveTime ?? Number.MAX_SAFE_INTEGER, // Fallback to a high number if solveTime is undefined.
      solveDate: currentDate,
    }));

    console.log("Winners", newWinners);
    setWinners(newWinners);
    updatePlayerData(newWinners);
  };

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

  function handleSaveCompetition() {
    socketRef.current?.emit('saveCompetition', boards);
    onClose();
  }



  return (
    <Box>
      <Center margin="center">
        <Heading textColor="#fff" fontSize="80px">Lockpicking Challenge</Heading>
      </Center>
      <SimpleGrid columns={3} padding="16px" spacing={16}
      >
        <GridItem colSpan={1} bg="gray.50" borderRadius='xl' padding="8">
          <Stopwatch
            gameActive={gameActive}
            handleTimerEnd={handleTimerEnd}
            handleStartStop={handleStartStop}
            handleReset={handleReset} />
          <GameOver isOpen={isOpen} onClose={onClose} lockboards={boards} setPlayerName={setPlayerName} />

        </GridItem>
        <GridItem colSpan={2} bg="gray.50" borderRadius='xl' padding="8">
          {<LockList boards={boards} />}
        </GridItem>
        {/*         <GridItem colSpan={3} bg="gray.50" borderRadius='xl' padding="8">
          <Leaderboard data={playerData} />
        </GridItem>
 */}      </SimpleGrid>

      {       /*
<Box margin='16px' padding='16px 16px 16px 16px' bg='gray.100'>
        <LockboardList boards={boards} onSave={onSave} />
      </Box>
      <Box padding='24px 24px 24px 24px'> */
      }

    </Box >
  );

}

export default LockboardPage;
