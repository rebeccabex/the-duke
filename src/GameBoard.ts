import { PlayerPiece } from "GamePiece";


export type GameBoard = Array<BoardSquare>;

export type BoardSquare = {
  coordinates: BoardCoordinates;
  piece: PlayerPiece | null;
}

export type BoardCoordinates = {x: number, y: number};