import express, { Express } from 'express';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import fs from 'fs';
import path from 'path';
import { Board, Pin } from 'johnny-five';
import performance from 'performance-now';
import Lockboard, { createLockboards, SolvedBoard } from '../../types/Lockboard';
import { Player } from '../../types/Player';
import { v4 as uuid } from 'uuid';

const app: Express = express();
const server: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const LEADERS_FILE = path.join(__dirname, '../../leaders.json');
let leaders: Player[] = [];
leaders = readLeaderboardFromFile();

let locks: Lockboard[];
let pins: Pin[];

let gameActive: boolean = false;
let gameStartTime: number | null = null;
const NUM_LOCKS: number = 6;

const board: Board = new Board({
  port: "/dev/cu.usbmodem2101", // Update the port according to your setup
  repl: false
});


board.on("ready", () => {
  console.log('Board ready.');

  pins = Array.from({ length: NUM_LOCKS }, (_, i) => new Pin(i + 2));
  // First pin on an arduino is 2, not 0. So lock 1 = pin 2.  
  locks = createLockboards(NUM_LOCKS);

  pins.forEach((pin, index) => {
    pin.read((error: any, value: number) => {
      const now: number = performance();
      const isLocked: boolean = value === 0;

      // The state of the lock has changed. We'll need to tell clients with our websocket.
      if (isLocked != locks[index].locked) {
        console.log("Lock changed to: " + isLocked);

        // If the lock has not been solved, and switched from locked to unlock,
        // mark it as now solved.
        if (gameActive && !locks[index].solved && locks[index].locked && !isLocked) {
          locks[index].solveTime = now - (gameStartTime || now);
          locks[index].solved = true;
        }

        locks[index].locked = isLocked;
        io.emit("updateLocks", locks);
      }

    });
  });
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Send the initial state of locks to the client.
  const currentTime: number | null = gameActive ? performance() - (gameStartTime || performance()) : null;
  socket.emit("currentState", locks, gameActive, leaders);

  socket.on('startGame', () => {
    console.log("Received startGame");
    if (!gameActive) {
      gameActive = true;
      gameStartTime = performance();
      io.emit("gameStarted");
    }
  });

  socket.on('endGame', () => {
    console.log("Received endGame");
    if (gameActive) {
      gameActive = false;
      const gameTime: number = performance() - (gameStartTime || performance());
      io.emit("gameEnded");
    }
  });

  socket.on('clearGame', () => {
    console.log("Received clearGame");
    if (gameActive) {
      gameActive = false;
      io.emit("gameCleared");
    }
    locks.forEach((lock, index) => {
      lock.solved = false;
      lock.solveTime = 0;
    });

    socket.emit("updateLocks", locks);
  });

  socket.on('saveCompetition', (solvedBoards: SolvedBoard[]) => {
    // Save the leaderboard
    saveLeaderboardToFile(solvedBoards);
    socket.emit("updateLeaderboard", leaders);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

function mapSolvedBoardsToPlayers(solvedBoards: SolvedBoard[]): Player[] {
  return solvedBoards.map(solvedBoard => ({
    id: uuid(), // Assuming you want to convert the numeric ID to a string
    name: solvedBoard.playerName || 'Unknown', // Default to 'Unknown' if playerName is undefined
    bestSolveTime: solvedBoard.solveTime,
    bestSolveDate: new Date().toISOString() // Use current date or a date from solvedBoard if available
  }));
}

function saveLeaderboardToFile(solvedBoards: SolvedBoard[]) {
  console.log('leaders: ', leaders);
  console.log('solvedboards', solvedBoards);
  const updatedLeaders = [...mapSolvedBoardsToPlayers(solvedBoards), ...leaders];

  fs.writeFile(LEADERS_FILE, JSON.stringify(updatedLeaders, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing leaders to file', err);
      // It's good practice to inform the client if there was an error
      io.emit('error', 'Failed to update leaderboard');
    } else {
      console.log('Successfully updated the leaderboard');
      leaders = updatedLeaders; // Update the in-memory leaders list
      io.emit('updateLeaderboard', leaders); // Emit the updated leaders to all clients
    }
  });
}

function readLeaderboardFromFile(): Player[] {
  try {
    const data = fs.readFileSync(LEADERS_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      // If parsedData is not an array, log a message and default to an empty array
      console.warn('Leaders data is not an array, defaulting to an empty array');
      return [];
    }
  } catch (error) {
    const e = error as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') {
      console.log('Leaders file does not exist, starting with an empty leaderboard');
      return [];
    } else {
      console.error('An error occurred while reading the leaders file:', error);
      return [];
    }
  }
}

server.listen(3000, () => {
  console.log('Server listening on *:3000');
});
