import { BoardSquare, BoardCoordinates, GameBoard, coordinatesAreInBoardSquareSelection } from "GameBoard";
import { MoveSet } from "MoveSet";
import { Player } from "Player";
import { AllMovementTypes } from "GamePhases";

export type StandardMovableSquares = {
  stepMovableSquares: Array<BoardSquare>,
  jumpMovableSquares: Array<BoardSquare>,
  slideMovableSquares: Array<BoardSquare>,
  jumpSlideMovableSquares: Array<BoardSquare>,
}

export type MovableSquares = {
  standardMovableSquares: StandardMovableSquares;
  strikeSquares: Array<BoardSquare>;
  commandSelectSquares: Array<BoardSquare>;
  commandTargetSquares: Array<BoardSquare>;
  commandStartSquare: BoardSquare | null;
}

export const emptyMovableSquares = (): MovableSquares => {
  return {
    standardMovableSquares: {
      stepMovableSquares: Array<BoardSquare>(),
      jumpMovableSquares: Array<BoardSquare>(),
      slideMovableSquares: Array<BoardSquare>(),
      jumpSlideMovableSquares: Array<BoardSquare>(),
    },
    strikeSquares: Array<BoardSquare>(),
    commandSelectSquares: Array<BoardSquare>(),
    commandTargetSquares: Array<BoardSquare>(),
    commandStartSquare: null,
  };
}

export const getAvailableMoveSquares = (
  moveSet: MoveSet,
  currentCoordinates: BoardCoordinates,
  gameBoard: GameBoard,
  currentPlayer: Player,
  playerIsWaiting: boolean = false,
  blockedCoordinates?: Array<BoardCoordinates>,
): MovableSquares => {
  const movableSquares = emptyMovableSquares();
  movableSquares.standardMovableSquares.stepMovableSquares.push(
    ...moveSet.getLegalTargetSquaresForSteps(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting, blockedCoordinates)
  );
  movableSquares.standardMovableSquares.jumpMovableSquares.push(
    ...moveSet.getLegalTargetSquaresForJumps(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting, blockedCoordinates)
  );
  movableSquares.standardMovableSquares.slideMovableSquares.push(
    ...moveSet.getLegalTargetSquaresForSlides(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting, blockedCoordinates)
  );
  movableSquares.standardMovableSquares.jumpSlideMovableSquares.push(
    ...moveSet.getLegalTargetSquaresForJumpSlides(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting, blockedCoordinates)
  );
  movableSquares.strikeSquares.push(
    ...moveSet.getLegalTargetSquaresForStrikes(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting)
  );
  movableSquares.commandSelectSquares.push(
    ...moveSet.getLegalPickUpSquaresForCommands(currentCoordinates, gameBoard, currentPlayer)
  );
  if (movableSquares.commandSelectSquares.length > 0) {
    movableSquares.commandTargetSquares.push(
      ...moveSet.getLegalMoveToSquaresForCommands(currentCoordinates, gameBoard, currentPlayer, playerIsWaiting)
    );
  }
  return movableSquares;
}

export const getMoveTypeAttackingCoordinates = (coordinates: BoardCoordinates, movableSquares: MovableSquares): AllMovementTypes => {
  if (coordinatesAreInBoardSquareSelection(movableSquares.strikeSquares, coordinates)) {
    return 'Strike';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.commandSelectSquares, coordinates)) {
    return 'CommandSelect';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.commandTargetSquares, coordinates)) {
    return 'CommandMove';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.standardMovableSquares.stepMovableSquares, coordinates)) {
    return 'Step';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.standardMovableSquares.jumpMovableSquares, coordinates)) {
    return 'Jump';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.standardMovableSquares.slideMovableSquares, coordinates)) {
    return 'Slide';
  }
  if (coordinatesAreInBoardSquareSelection(movableSquares.standardMovableSquares.jumpSlideMovableSquares, coordinates)) {
    return 'JumpSlide';
  }
  return 'none';
}
