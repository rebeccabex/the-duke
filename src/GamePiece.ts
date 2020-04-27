import {
  BoardCoordinates,
  MovableSquares,
  emptyMovableSquares,
  getAvailableMoveSquares,
  GameBoard,
  BoardSquare,
} from "GameBoard";
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
      this.potentialMoves = getAvailableMoveSquares(currentMoveSet, this.position, gameBoard, player, playerIsWaiting, invalidCoordinates);
    } else {
      console.log(`Cannot update potential moves of ${this.colour}'s ${this.name} as it does have a valid position.`)
    }
  }

  reducePotentialMovesToValidMoves(legalCoordinates: Array<BoardCoordinates>) {
    this.potentialMoves.standardMovableSquares.stepMovableSquares =
      this.potentialMoves.standardMovableSquares.stepMovableSquares.filter(square => legalCoordinates.includes(square.coordinates));
    this.potentialMoves.standardMovableSquares.jumpMovableSquares =
      this.potentialMoves.standardMovableSquares.jumpMovableSquares.filter(square => legalCoordinates.includes(square.coordinates));
    this.potentialMoves.standardMovableSquares.slideMovableSquares =
      this.potentialMoves.standardMovableSquares.slideMovableSquares.filter(square => legalCoordinates.includes(square.coordinates));
    this.potentialMoves.standardMovableSquares.jumpSlideMovableSquares =
      this.potentialMoves.standardMovableSquares.jumpSlideMovableSquares.filter(square => legalCoordinates.includes(square.coordinates));
    this.potentialMoves.strikeSquares =
      this.potentialMoves.strikeSquares.filter(square => legalCoordinates.includes(square.coordinates));
    this.potentialMoves.commandTargetSquares =
      this.potentialMoves.commandTargetSquares.filter(square => legalCoordinates.includes(square.coordinates));
    if (this.potentialMoves.commandTargetSquares.length === 0) {
      this.potentialMoves.commandSelectSquares = Array<BoardSquare>();
    }
  }

  clearPotentialMoves() {
    this.potentialMoves = emptyMovableSquares();
  }

  canMove() {
    return this.potentialMoves.standardMovableSquares.stepMovableSquares.length > 0 ||
      this.potentialMoves.standardMovableSquares.jumpMovableSquares.length > 0 ||
      this.potentialMoves.standardMovableSquares.slideMovableSquares.length > 0 ||
      this.potentialMoves.standardMovableSquares.jumpSlideMovableSquares.length > 0 ||
      this.potentialMoves.strikeSquares.length > 0 ||
      (this.potentialMoves.commandSelectSquares.length > 0 &&
      this.potentialMoves.commandTargetSquares.length > 0);
  }
}
