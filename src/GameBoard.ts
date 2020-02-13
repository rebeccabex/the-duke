import { PlayerPiece } from "GamePiece";


export type GameBoard = Array<BoardSquare>;

export type BoardSquare = {
  coordinates: BoardCoordinates;
  piece: PlayerPiece | null;
}

export type BoardCoordinates = {x: number, y: number};

export const coordinatesEqual = (coordinates1: BoardCoordinates, coordinates2: BoardCoordinates): boolean => {
  return coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;
}

export const coordinatesInSelection = (selection: BoardCoordinates[], coordinates: BoardCoordinates): boolean => {
  return selection.some(c => coordinatesEqual(c, coordinates));
}

export type GameStage = 'Start' | 'Setup' | 'Playing' | 'Finished';

export type GamePhase = SetupPhase | PlayingPhase | null;

export type SetupPhase = 'PlacingDuke' | 'PlacingFootsoldier1' | 'PlacingFootsoldier2'

export type PlayingPhase = 'ChoosingMove' | 'MovingPiece' | 'PlacingPiece';