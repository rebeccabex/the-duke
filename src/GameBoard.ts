import { PlayerPiece, MoveSet } from "GamePiece";
import { Player } from "Player";

export type GameBoard = Array<BoardSquare>;

export const createGameBoard = (): Array<BoardSquare>  => {
  var newGameBoard = new Array<BoardSquare>();
  for (let i = 0; i < 6 ; i++) {
      for (let j = 0; j < 6; j++) {
          var boardSquare: BoardSquare = { coordinates: {x: i, y: j}, piece: null};
          newGameBoard.push(boardSquare);
      }
  }
  return newGameBoard;
}

export type BoardSquare = {
  coordinates: BoardCoordinates;
  piece: PlayerPiece | null;
}

export type BoardCoordinates = {x: number, y: number};

export const boardSquareIsEmpty = (boardSquare?: BoardSquare): boolean => {
  return !!boardSquare && boardSquare.piece === null;
}

export const boardSquareContainsEnemy = (boardSquare: BoardSquare, currentPlayer: Player): boolean => {
  return boardSquare.piece !== null && boardSquare.piece.player.colour !== currentPlayer.colour;
}

export const coordinatesEqual = (coordinates1: BoardCoordinates | null, coordinates2: BoardCoordinates | null): boolean => {
  return !!coordinates1 && !!coordinates2 && coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;
}

export const applyMoveToCoordinates = (currentCoordinates: BoardCoordinates, move: BoardCoordinates): BoardCoordinates => {
  return {x: currentCoordinates.x + move.x, y: currentCoordinates.y + move.y};
}

export const multiplyMoveVectorByScalar = (moveVector: BoardCoordinates, scalar: number): BoardCoordinates => {
  return {x: moveVector.x * scalar, y: moveVector.y * scalar}
}

export const applyRangeOfMovesToCoordinates = (currentCoordinates: BoardCoordinates, direction: BoardCoordinates): BoardCoordinates[] => {
  const rangeOfCoordinates = new Array<BoardCoordinates>();
  for (var i = 1; i < 6; i++) {
    const newCoordinates = applyMoveToCoordinates(currentCoordinates, {x: direction.x * i, y: direction.y * i});
    rangeOfCoordinates.push(newCoordinates);
  }
  return rangeOfCoordinates;
}

export const coordinatesInSelection = (selection: BoardCoordinates[], coordinates: BoardCoordinates): boolean => {
  return selection.some(c => coordinatesEqual(c, coordinates));
}

export const getOrthogonallyAdjacentSquares = (currentSquare: BoardCoordinates): BoardCoordinates[] => {
  var neighbourhood = [];

  for (var i = -1; i < 2; i++){
    for (var j = -1; j < 2; j++){
      const coordinates = {x: currentSquare.x + i, y: currentSquare.y + j};
      if (Math.abs(i) !== Math.abs(j) && areValidCoordinates(coordinates)) {
        neighbourhood.push(coordinates);
      }
    }
  }
  return neighbourhood;
}

export const areValidCoordinates = (coordinates: BoardCoordinates): boolean => {
  return coordinates.x >= 0 && coordinates.x < 6 && coordinates.y >= 0 && coordinates.y < 6;
}

export const returnValidCoordinatesFromRange = (range: BoardCoordinates[]): BoardCoordinates[] => {
  return range.filter(coordinates => areValidCoordinates(coordinates));
}

export const getAvailableMoveSquares = (
  moveSet: MoveSet,
  currentCoordinates: BoardSquare,
  gameBoard: GameBoard,
  currentPlayer: Player
): BoardCoordinates[] => {
  const legalSquares = moveSet.getLegalTargetCoordinatesForMovesAndJumps(currentCoordinates, gameBoard, currentPlayer);
  legalSquares.push(...moveSet.getLegalTargetCoordinatesForSlides(currentCoordinates, gameBoard, currentPlayer));
  legalSquares.push(...moveSet.getLegalTargetCoordinatesForJumpSlides(currentCoordinates, gameBoard, currentPlayer));
  legalSquares.push(...moveSet.getLegalTargetCoordinatesForStrikes(currentCoordinates, gameBoard, currentPlayer));
  legalSquares.push(...moveSet.getLegalTargetCoordinatesForCommands(currentCoordinates, gameBoard, currentPlayer));

  return legalSquares.filter((coordinates, index, range) => index === range.indexOf(coordinates));
}

export type GameStage = 'Start' | 'Setup' | 'Playing' | 'Finished';

export type GamePhase = SetupPhase | PlayingPhase | null;

export type SetupPhase = 'PlacingDuke' | 'PlacingFootsoldier1' | 'PlacingFootsoldier2'

export type PlayingPhase = 'ChoosingMove' | 'MovingPiece' | 'PlacingPiece';