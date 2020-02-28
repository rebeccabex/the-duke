import { GamePiece } from "GamePiece";

export class Duke extends GamePiece {
  constructor() {
    super('Duke');
    this.initialMoveSet.addSlides([{"x": 1, "y": 0}, {"x": -1, "y": 0}]);
    
    this.flippedMoveSet.addSlides([{"x": 0, "y": -1}, {"x": 0, "y": 1}]);
  }
}

export class Footsoldier extends GamePiece {
  constructor() {
    super('Footsoldier');
    this.initialMoveSet.addMoves([
      {"x": 0, "y": 1},
      {"x": 0, "y": -1},
      {"x": 1, "y": 0},
      {"x": -1, "y": 0},
    ]);
    this.flippedMoveSet.addMoves([
      {"x": 1, "y": 1},
      {"x": 1, "y": -1},
      {"x": -1, "y": 1},
      {"x": -1, "y": -1},
      {"x": 0, "y": 2}
    ]);
  }
}

export const BagPieceList = [
  'Pikeman',
  'Pikeman',
  'Pikeman',
  'Footsoldier',
]

export class Pikeman extends GamePiece {
  constructor() {
    super('Pikeman');
    this.initialMoveSet.addMoves([
      {"x": 1, "y": 1},
      {"x": 2, "y": 2},
      {"x": -1, "y": 1},
      {"x": -2, "y": 2},
    ]);
    this.flippedMoveSet.addMoves([
      {"x": 0, "y": -1},
      {"x": 0, "y": -2},
      {"x": 0, "y": 1},
    ]);
    this.flippedMoveSet.addStrikeSpots([
      {"x": 1, "y": 2},
      {"x": -1, "y": 2},
    ])
  }
}