interface LockboardInitializer {
  id: number;
  number: number;
  locked?: boolean;
  solveTime?: number;
  solved?: boolean;
  numberLockPins: number;
}

export default class Lockboard {
  id: number;
  number: number;
  locked: boolean;
  solveTime: number | undefined; // If solveTime can be undefined, keep it as is
  solved: boolean;
  numberLockPins: number;

  constructor({
    id,
    number,
    locked = false, // Provide a default value if locked is optional
    solveTime,
    solved = false, // Provide a default value if solved is optional
    numberLockPins,
  }: LockboardInitializer) {
    this.id = id;
    this.number = number;
    this.locked = locked;
    this.solveTime = solveTime;
    this.solved = solved;
    this.numberLockPins = numberLockPins;
  }
}

export interface SolvedBoard extends Lockboard {
  playerName?: string;
}


export function createLockboards(num: number): Lockboard[] {
  return Array.from({ length: num }, (_, i) => new Lockboard({
    id: i,
    number: i + 1,
    locked: false,
    solveTime: undefined,
    solved: false,
    numberLockPins: 5
  }))
}

