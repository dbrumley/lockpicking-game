export default class Lockboard {
  id: number;
  number: number;
  locked: boolean | undefined;
  solveTime: number | undefined;
  solved: boolean;
  player: string | undefined;
  numberLockPins: number;

  constructor(initializer?: any) {
    if (!initializer) return;
    if (typeof initializer.id !== 'undefined') this.id = initializer.id;
    if (typeof initializer.number !== 'undefined') this.number = initializer.number;
    if (typeof initializer.locked !== 'undefined') this.locked = initializer.locked;
    if (typeof initializer.solveTime !== 'undefined') this.solveTime = initializer.solveTime;
    if (typeof initializer.solved !== 'undefined') this.solved = initializer.solved;
    if (typeof initializer.player !== 'undefined') this.player = initializer.player;
    if (typeof initializer.numberLockPins !== 'undefined') this.numberLockPins = initializer.numberLockPins;
  }
}

export function createLockboards(num: number): Lockboard[] {
  return Array.from({ length: num }, (_, i) => new Lockboard({
    id: i,
    number: i + 1,
    locked: false,
    solveTime: undefined,
    solved: false,
    player: undefined,
    numberLockPins: 5
  }))
}

