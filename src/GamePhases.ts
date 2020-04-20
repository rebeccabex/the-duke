import { BoardCoordinates, MovableSquares, coordinatesEqual, boardCoordinatesToString } from "GameBoard";

export type GameStage = 'Start' | 'Setup' | 'Playing' | 'Finished';

export type GamePhase = SetupPhase | PlayingPhase | null;

export type SetupPhase = 'PlacingDuke' | 'PlacingFootsoldier1' | 'PlacingFootsoldier2'

export type PlayingPhase = 'ChoosingMove' | 'MovingPiece' | 'PlacingPiece' | 'CarryingOutCommand';

export type MovementType = 'StandardMove' | 'Strike' | 'CommandSelect' | 'CommandMove';

export const getMovementType = (movableSquares: MovableSquares, squareCoordinates: BoardCoordinates): MovementType | null => {
  if (movableSquares.standardMovableSquares.some(square => coordinatesEqual(square.coordinates, squareCoordinates))) {
    return 'StandardMove';
  }
  if (movableSquares.strikeSquares.some(square => coordinatesEqual(square.coordinates, squareCoordinates))) {
    return 'Strike';
  }
  if (movableSquares.commandSelectSquares.some(square => coordinatesEqual(square.coordinates, squareCoordinates))) {
    return 'CommandSelect';
  }
  if (movableSquares.commandTargetSquares.some(square => coordinatesEqual(square.coordinates, squareCoordinates))) {
    return 'CommandMove';
  }
  console.log(`Invalid move. Square ${boardCoordinatesToString(squareCoordinates)}`);
  return null;
}