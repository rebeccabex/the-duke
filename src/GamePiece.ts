import {
  BoardCoordinates,
  applyMoveToCoordinates,
  areValidCoordinates,
  coordinatesEqual,
  GameBoard,
  boardSquareIsEmpty,
  BoardSquare,
  boardSquareContainsEnemy,
  multiplyMoveVectorByScalar,
  isStandardMoveBlocked,
  boardSquareContainsFriendlyPiece
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

  flipPiece() {
    this.isFlipped = !this.isFlipped;
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

  getLegalTargetSquaresForStandardMoves(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    [this.moves].forEach(moveType =>
      moveType.forEach(move => {
        let newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : move;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
            if (boardSquareIsEmpty(newBoardSquare) || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
              if (Math.abs(newMove.x) > 1 || Math.abs(newMove.y) > 1) {
                if (!isStandardMoveBlocked(currentSquare.coordinates, newMove, gameBoard)) {
                  legalSquares.push(newBoardSquare);
                }
              } else {
                legalSquares.push(newBoardSquare);
              }
            }
          }
        }
      })
    );
    return legalSquares;
  }

  getLegalTargetSquaresForJumps(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    [this.jumps].forEach(moveType =>
      moveType.forEach(move => {
        let newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : move;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
            if (boardSquareIsEmpty(newBoardSquare) || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
              legalSquares.push(newBoardSquare);
            }
          }
        }
      })
    );
    return legalSquares;
  }

  getLegalTargetSquaresForSlides(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    this.slides.forEach(move => {
      let tryNextSquare = true;
      let distance = 1;
      while (tryNextSquare) {
        let newMove = multiplyMoveVectorByScalar(move, distance);
        newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(newMove, -1) : newMove;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
              if (boardSquareIsEmpty(newBoardSquare)) {
                legalSquares.push(newBoardSquare);
                distance++;
              } else if (boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
                legalSquares.push(newBoardSquare);
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

  getLegalTargetSquaresForJumpSlides(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    this.jumpSlides.forEach(move => {
      let tryNextSquare = true;
      let distance = 2;
      while (tryNextSquare) {
        let newMove = multiplyMoveVectorByScalar(move, distance);
        newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(newMove, -1) : newMove;
        const newCoordinates = applyMoveToCoordinates(currentSquare.coordinates, newMove);
        if (areValidCoordinates(newCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
              if (boardSquareIsEmpty(newBoardSquare)) {
                legalSquares.push(newBoardSquare);
                distance++;
              } else if (boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
                legalSquares.push(newBoardSquare);
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

  getLegalTargetSquaresForStrikes(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    this.strikes.forEach(strike => {
      const directedStrike = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(strike, -1) : strike;
      const targetCoordinates = applyMoveToCoordinates(currentSquare.coordinates, directedStrike);
      if (areValidCoordinates(targetCoordinates)) {
        const targetSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, targetCoordinates));
        if (targetSquare && boardSquareContainsEnemy(targetSquare, currentPlayer)) {
          legalSquares.push(targetSquare);
        }
      }
    });
    return legalSquares;
  }

  getLegalTargetSquaresForCommands(currentSquare: BoardSquare, gameBoard: GameBoard, currentPlayer: Player) {
    const legalSquares = new Array<BoardSquare>();
    this.commands.forEach(command => {
      const directedCommand = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(command, -1) : command;
      const targetCoordinates = applyMoveToCoordinates(currentSquare.coordinates, directedCommand);
      if (areValidCoordinates(targetCoordinates)) {
        const targetSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, targetCoordinates));
        if (targetSquare && boardSquareContainsFriendlyPiece(targetSquare, currentPlayer)) {
          legalSquares.push(targetSquare);
        }
      }
    });
    return legalSquares;
  }
}

export type PlayerPiece = {
  player: Player,
  piece: GamePiece,
}