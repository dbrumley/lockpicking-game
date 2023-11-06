import express, { Express } from 'express';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Board, Pin } from 'johnny-five';
import performance from 'performance-now';

const app: Express = express();
const server: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

class Lockboard {
  id: number;
  number: number;
  locked: boolean | undefined;
  solveTime: number;
  solved: boolean;
  owner: string | undefined;

  constructor(id: number, number: number) {
    this.id = id;
    this.number = number;
    this.locked = undefined;
    this.solveTime = 0;
    this.solved = false;
    this.owner = undefined;
  }
}


let locks: Lockboard[];
let pins: Pin[];

let gameActive: boolean = false;
let gameStartTime: number | null = null;
const NUM_LOCKS: number = 5;

const board: Board = new Board({
  port: "/dev/cu.usbmodem1101", // Update the port according to your setup
  repl: false
});


board.on("ready", () => {
  console.log('Board ready.');

  pins = Array.from({ length: NUM_LOCKS }, (_, i) => new Pin(i + 2));
  // First pin on an arduino is 2, not 0. So lock 1 = pin 2.  
  locks = Array.from({ length: NUM_LOCKS }, (_, i) => new Lockboard(i + 2, i + 1));

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
        io.emit("lockStateChanged", locks);
      }

    });
  });
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Send the initial state of locks to the client.
  const currentTime: number | null = gameActive ? performance() - (gameStartTime || performance()) : null;
  socket.emit("initialLockStates", locks, gameActive);

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
      console.log("Sending back gameEnded");
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

    socket.emit("initialLockStates", locks, gameActive);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on *:3000');
});
