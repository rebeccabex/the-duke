import {
  BoardCoordinates,
  applyMoveToCoordinates,
  areValidCoordinates,
  coordinatesEqual,
  GameBoard,
  boardSquareIsEmpty,
  BoardSquare,
  boardSquareContainsEnemy,
  multiplyMoveVectorByScalar
} from "GameBoard";
import { Player } from "Player";

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
}

export class MoveSet {
  moves: Array<BoardCoordinates>;
  jumps: Array<BoardCoordinates>;
  slides: Array<BoardCoordinates>;
  jumpSlides: Array<BoardCoordinates>;
  strikes: Array<BoardCoordinates>;
  commands: Array<BoardCoordinates>;

  constructor(
    move?: Array<BoardCoordinates>,
    jump?: Array<BoardCoordinates>,
    slide?: Array<BoardCoordinates>,
    jumpSlide?: Array<BoardCoordinates>,
    strike?: Array<BoardCoordinates>,
    command?: Array<BoardCoordinates>,
  ) {
    this.moves = move ? move : [];
    this.jumps = jump ? jump : [];
    this.slides = slide ? slide : [];
    this.jumpSlides = jumpSlide ? jumpSlide : [];
    this.strikes = strike ? strike : [];
    this.commands = command ? command : [];
  }

  // TODO: Add ability to handle more human-readable descriptions 'Slide: Left'
  addMoves(landingSquares: Array<BoardCoordinates>) {
    this.moves.push(...landingSquares);
  }

  addJumps(landingSquares: Array<BoardCoordinates>) {
    this.jumps.push(...landingSquares);
  }

  addSlides(directions:  Array<BoardCoordinates>) {
    this.slides.push(...directions);
  }

  addJumpSlide(directions: Array<BoardCoordinates>) {
    this.jumpSlides.push(...directions);
  }

  addStrikeSpots(targetSquares: Array<BoardCoordinates>) {
    this.strikes.push(...targetSquares);
  }

  addCommandSpots(targetSquares: Array<BoardCoordinates>) {
    this.commands.push(...targetSquares);
  }

  getLegalTargetCoordinatesForMovesAndJumps(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardCoordinates>();
    [this.moves, this.jumps].forEach(moveType =>
      moveType.forEach(move => {
        let newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : move;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
            if (boardSquareIsEmpty(newBoardSquare) || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
              legalSquares.push(newCoordinates);
            }
          }
        }
      })
    );
    return legalSquares;
  }

  getLegalTargetCoordinatesForSlides(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardCoordinates>();
    this.slides.forEach(move => {
      let tryNextSquare = true;
      let distance = 1;
      while (tryNextSquare) {
        let newMove = multiplyMoveVectorByScalar(move, distance);
        newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : newMove;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
              if (boardSquareIsEmpty(newBoardSquare)) {
                legalSquares.push(newCoordinates);
                distance++;
              } else if (boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
                legalSquares.push(newCoordinates);
                tryNextSquare = false;
              } else {
                tryNextSquare = false;
              }
          }
        } else {
          tryNextSquare = false;
        }
      }
    });
   return legalSquares;
  }

  getLegalTargetCoordinatesForJumpSlides(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardCoordinates>();
    
   return legalSquares;
  }

  getLegalTargetCoordinatesForStrikes(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardCoordinates>();
    return legalSquares;
  }

  getLegalTargetCoordinatesForCommands(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardCoordinates>();
    return legalSquares;
  }
}

export type PlayerPiece = {
  player: Player,
  piece: GamePiece,
}