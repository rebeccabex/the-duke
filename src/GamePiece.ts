import { BoardCoordinates, MovableSquares, emptyMovableSquares, getAvailableMoveSquares, GameBoard } from "GameBoard";
import { MoveSet } from "MoveSet";
import { Player } from "Player";

export class GamePiece {
  name: string;
  initialMoveSet: MoveSet;
  flippedMoveSet: MoveSet;
  isFlipped: boolean;
  position: BoardCoordinates | null;
  colour: string;
  isLeader: boolean;
  potentialMoves: MovableSquares;
  
  constructor(name: string, colour: string, isLeader: boolean = false, startingPosition: BoardCoordinates | null = null) {
    this.name = name;
    this.initialMoveSet = new MoveSet();
    this.flippedMoveSet = new MoveSet();
    this.isFlipped = false;
    this.position = startingPosition;
    this.colour = colour;
    this.isLeader = isLeader;
    this.potentialMoves = emptyMovableSquares();
  }

  flipPiece() {
    this.isFlipped = !this.isFlipped;
  }

  updatePosition(newCoordinates: BoardCoordinates) {
    this.position = newCoordinates;
  }

  pieceTaken() {
    this.position = null;
    this.potentialMoves = emptyMovableSquares();
  }

  updatePotentialMoves(
    gameBoard: GameBoard,
    player: Player,
    playerIsWaiting: boolean = false,
    invalidCoordinates?: Array<BoardCoordinates>
  ) {
    if (this.position) {
      const currentMoveSet = this.isFlipped ? this.flippedMoveSet: this.initialMoveSet;
      return getAvailableMoveSquares(currentMoveSet, this.position, gameBoard, player, playerIsWaiting, invalidCoordinates);
    } else {
      console.log(`Cannot update potential moves of ${this.colour}'s ${this.name} as it does have a valid position.`)
    }
  }
}
