import { v4 as uuid } from 'uuid';

export type Player = {
  id: string;
  name: string;
  bestSolveTime: number | undefined;
  bestSolveDate: string;
}

export const defaultData: Player[] = [
  {
    id: uuid(),
    name: 'John Smith',
    bestSolveTime: 10 * 60 * 1000,
    bestSolveDate: '2023-08-04T22:39:41.473Z'
  },
  {
    id: uuid(),
    name: 'John Smith',
    bestSolveTime: 10 * 60 * 1000,
    bestSolveDate: '2023-08-04T22:39:41.473Z'
  },
  {
    id: uuid(),
    name: 'Fred Jones',
    bestSolveTime: 10 * 60 * 1001,
    bestSolveDate: '2023-08-05T22:39:41.473Z'
  },
  {
    id: uuid(),
    name: 'Mayhem Bot',
    bestSolveTime: 10 * 60 * 999,
    bestSolveDate: '2023-08-07T22:39:41.473Z'
  },
  {
    id: uuid(),
    name: 'Ada Lovelace',
    bestSolveTime: 10 * 60 * 1002,
    bestSolveDate: '2023-08-06T22:39:41.473Z'
  },
]

/* export type Player2 {
  name: string;
  id: string = uuid();
  bestSolveTime: number | undefined;
  bestSolveDate: Date = new Date();

  constructor(initializer?: any) {
  if (!initializer) return;
  if (typeof initializer.name != "undefined") this.name = initializer.name;
  if (typeof initializer.id != "undefined") this.id = initializer.id;
  if (typeof initializer.bestSolveTime != "undefined")
    this.bestSolveTime = initializer.bestSolveTime;
  if (typeof initializer.bestSolveDate != "undefined")
    this.bestSolveDate = new Date(initializer.bestSolveDate);
}
}*/
