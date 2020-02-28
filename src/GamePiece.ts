import { BoardCoordinates } from "GameBoard";
import { Player } from "Player";
import { MoveSet } from "MoveSet";

export class GamePiece {
  name: string;
  initialMoveSet: MoveSet;
  flippedMoveSet: MoveSet;
  isFlipped: boolean;
  position: BoardCoordinates | null;
  
  constructor(name: string, startingPosition: BoardCoordinates | null = null) {
    this.name = name;
    this.initialMoveSet = new MoveSet();
    this.flippedMoveSet = new MoveSet();
    this.isFlipped = false;
    this.position = startingPosition
  }

  flipPiece() {
    this.isFlipped = !this.isFlipped;
  }
}

export type PlayerPiece = {
  player: Player,
  piece: GamePiece,
}