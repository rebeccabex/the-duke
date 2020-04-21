import {
  RelativeCoordinates,
  BoardSquare,
  GameBoard,
  multiplyMoveVectorByScalar,
  applyMoveToCoordinates,
  areCoordinatesOnBoard,
  coordinatesEqual,
  boardSquareIsEmpty,
  boardSquareContainsEnemy,
  isStandardMoveBlocked,
  boardSquareContainsFriendlyPiece,
  BoardCoordinates,
  areCoordinatesValidForMove
} from "GameBoard";
import { Player } from "Player";

export class MoveSet {
  steps: Array<RelativeCoordinates>;
  jumps: Array<RelativeCoordinates>;
  slides: Array<RelativeCoordinates>;
  jumpSlides: Array<RelativeCoordinates>;
  strikes: Array<RelativeCoordinates>;
  commands: Array<RelativeCoordinates>;

  constructor(
    step?: Array<RelativeCoordinates>,
    jump?: Array<RelativeCoordinates>,
    slide?: Array<RelativeCoordinates>,
    jumpSlide?: Array<RelativeCoordinates>,
    strike?: Array<RelativeCoordinates>,
    command?: Array<RelativeCoordinates>,
  ) {
    this.steps = step ? step : [];
    this.jumps = jump ? jump : [];
    this.slides = slide ? slide : [];
    this.jumpSlides = jumpSlide ? jumpSlide : [];
    this.strikes = strike ? strike : [];
    this.commands = command ? command : [];
  }

  // TODO: Add ability to handle more human-readable descriptions 'Slide: Left'
  addMoves(landingSquares: Array<RelativeCoordinates>) {
    this.steps.push(...landingSquares);
  }

  addJumps(landingSquares: Array<RelativeCoordinates>) {
    this.jumps.push(...landingSquares);
  }

  addSlides(directions:  Array<RelativeCoordinates>) {
    this.slides.push(...directions);
  }

  addJumpSlide(directions: Array<RelativeCoordinates>) {
    this.jumpSlides.push(...directions);
  }

  addStrikeSpots(targetSquares: Array<RelativeCoordinates>) {
    this.strikes.push(...targetSquares);
  }

  addCommandSpots(targetSquares: Array<RelativeCoordinates>) {
    this.commands.push(...targetSquares);
  }

  getLegalTargetSquaresForSteps(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
    blockedCoordinates?: Array<BoardCoordinates>,
  ) {
    const legalSquares = new Array<BoardSquare>();
    [this.steps].forEach(moveType =>
      moveType.forEach(move => {
        let newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : move;
        const newCoordinates = applyMoveToCoordinates(currentCoordinates, newMove);
        if (areCoordinatesValidForMove(newCoordinates, blockedCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
            if (playerIsWaiting || boardSquareIsEmpty(newBoardSquare) || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
              if (Math.abs(newMove.x) > 1 || Math.abs(newMove.y) > 1) {
                if (!isStandardMoveBlocked(currentCoordinates, newMove, gameBoard)) {
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

  getLegalTargetSquaresForJumps(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
    blockedCoordinates?: Array<BoardCoordinates>,
  ) {
    const legalSquares = new Array<BoardSquare>();
    [this.jumps].forEach(moveType =>
      moveType.forEach(move => {
        let newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(move, -1) : move;
        const newCoordinates = applyMoveToCoordinates(currentCoordinates, newMove);
        if (areCoordinatesValidForMove(newCoordinates, blockedCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
            if (playerIsWaiting || boardSquareIsEmpty(newBoardSquare) || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
              legalSquares.push(newBoardSquare);
            }
          }
        }
      })
    );
    return legalSquares;
  }

  getLegalTargetSquaresForSlides(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
    blockedCoordinates?: Array<BoardCoordinates>,
  ) {
    const legalSquares = new Array<BoardSquare>();
    this.slides.forEach(move => {
      let tryNextSquare = true;
      let distance = 1;
      while (tryNextSquare) {
        let newMove = multiplyMoveVectorByScalar(move, distance);
        newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(newMove, -1) : newMove;
        const newCoordinates = applyMoveToCoordinates(currentCoordinates, newMove);
        if (areCoordinatesValidForMove(newCoordinates, blockedCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
              if (boardSquareIsEmpty(newBoardSquare)) {
                legalSquares.push(newBoardSquare);
                distance++;
              } else if (playerIsWaiting || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
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

  getLegalTargetSquaresForJumpSlides(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
    blockedCoordinates?: Array<BoardCoordinates>,
  ) {
    const legalSquares = new Array<BoardSquare>();
    this.jumpSlides.forEach(move => {
      let tryNextSquare = true;
      let distance = 2;
      while (tryNextSquare) {
        let newMove = multiplyMoveVectorByScalar(move, distance);
        newMove = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(newMove, -1) : newMove;
        const newCoordinates = applyMoveToCoordinates(currentCoordinates, newMove);
        if (areCoordinatesValidForMove(newCoordinates, blockedCoordinates)) {
          const newBoardSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, newCoordinates));
          if (!!newBoardSquare) {
              if (boardSquareIsEmpty(newBoardSquare)) {
                legalSquares.push(newBoardSquare);
                distance++;
              } else if (playerIsWaiting || boardSquareContainsEnemy(newBoardSquare, currentPlayer)) {
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

  getLegalTargetSquaresForStrikes(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
  ) {
    const legalSquares = new Array<BoardSquare>();
    this.strikes.forEach(strike => {
      const directedStrike = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(strike, -1) : strike;
      const targetCoordinates = applyMoveToCoordinates(currentCoordinates, directedStrike);
      if (areCoordinatesOnBoard(targetCoordinates)) {
        const targetSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, targetCoordinates));
        if (targetSquare && (playerIsWaiting || boardSquareContainsEnemy(targetSquare, currentPlayer))) {
          legalSquares.push(targetSquare);
        }
      }
    });
    return legalSquares;
  }

  getLegalPickUpSquaresForCommands(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
  ) {
    const legalSquares = new Array<BoardSquare>();
    this.commands.forEach(command => {
      const directedCommand = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(command, -1) : command;
      const targetCoordinates = applyMoveToCoordinates(currentCoordinates, directedCommand);
      if (areCoordinatesOnBoard(targetCoordinates)) {
        const targetSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, targetCoordinates));
        if (targetSquare && boardSquareContainsFriendlyPiece(targetSquare, currentPlayer)) {
          legalSquares.push(targetSquare);
        }
      }
    });
    return legalSquares;
  }

  getLegalMoveToSquaresForCommands(
    currentCoordinates: BoardCoordinates,
    gameBoard: GameBoard,
    currentPlayer: Player,
    playerIsWaiting: boolean = false,
  ) {
    const legalSquares = new Array<BoardSquare>();
    this.commands.forEach(command => {
      const directedCommand = currentPlayer.directionReversed ? multiplyMoveVectorByScalar(command, -1) : command;
      const targetCoordinates = applyMoveToCoordinates(currentCoordinates, directedCommand);
      if (areCoordinatesOnBoard(targetCoordinates)) {
        const targetSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, targetCoordinates));
        if (targetSquare && (playerIsWaiting || boardSquareIsEmpty(targetSquare) || boardSquareContainsEnemy(targetSquare, currentPlayer))) {
          legalSquares.push(targetSquare);
        }
      }
    });
    return legalSquares;
  }
}
