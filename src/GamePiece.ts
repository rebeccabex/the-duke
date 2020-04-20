import { BoardCoordinates } from "GameBoard";
import { MoveSet } from "MoveSet";
import { Duke, Footsoldier, Pikeman } from "PieceData";

export class GamePiece {
  name: string;
  initialMoveSet: MoveSet;
  flippedMoveSet: MoveSet;
  isFlipped: boolean;
  position: BoardCoordinates | null;
  colour: string;
  
  constructor(name: string, colour: string, startingPosition: BoardCoordinates | null = null) {
    this.name = name;
    this.initialMoveSet = new MoveSet();
    this.flippedMoveSet = new MoveSet();
    this.isFlipped = false;
    this.position = startingPosition;
    this.colour = colour;
  }

  flipPiece() {
    this.isFlipped = !this.isFlipped;
  }
}
