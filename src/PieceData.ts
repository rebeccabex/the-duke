import { GamePiece } from "GamePiece";

export const BagPieceList = [
  'Pikeman',
  'Pikeman',
  'Pikeman',
  'Footsoldier',
]

export const createNewPiece = (pieceName: string, colour: string): GamePiece | null => {
  switch(pieceName) {
    case 'Duke':
      return new Duke(colour);
    case 'Footsoldier':
      return new Footsoldier(colour);
    case 'Pikeman': 
      return new Pikeman(colour);
    default:
      console.log(`Cannot create piece, invalid piece name '${pieceName}'`)
      return null;
  }
}

export class Duke extends GamePiece {
  constructor(colour: string) {
    super('Duke', colour, true);
    this.initialMoveSet.addSlides([{x: 1, y: 0}, {x: -1, y: 0}]);
    
    this.flippedMoveSet.addSlides([{x: 0, y: -1}, {x: 0, y: 1}]);
  }
}

export class Footsoldier extends GamePiece {
  constructor(colour: string) {
    super('Footsoldier', colour);
    this.initialMoveSet.addSteps([
      {x: 0, y: 1},
      {x: 0, y: -1},
      {x: 1, y: 0},
      {x: -1, y: 0},
    ]);
    this.flippedMoveSet.addSteps([
      {x: 1, y: 1},
      {x: 1, y: -1},
      {x: -1, y: 1},
      {x: -1, y: -1},
      {x: 0, y: 2}
    ]);
  }
}

export class Pikeman extends GamePiece {
  constructor(colour: string) {
    super('Pikeman', colour);
    this.initialMoveSet.addSteps([
      {x: 1, y: 1},
      {x: 2, y: 2},
      {x: -1, y: 1},
      {x: -2, y: 2},
    ]);
    this.flippedMoveSet.addSteps([
      {x: 0, y: -1},
      {x: 0, y: -2},
      {x: 0, y: 1},
    ]);
    this.flippedMoveSet.addStrikeSpots([
      {x: 1, y: 2},
      {x: -1, y: 2},
    ])
  }
}