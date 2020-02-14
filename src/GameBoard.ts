import { PlayerPiece } from "GamePiece";

export type GameBoard = Array<BoardSquare>;

// export const moveOrPlacePiece = (piece: PlayerPiece, newCoordinates: BoardCoordinates, oldCoordinates: BoardCoordinates | null = null): void => {
//     if (!!oldCoordinates) {
//       this.clearSquare(oldCoordinates);
//     }
//     const newSquare = this.gameBoard.find(s => coordinatesEqual(s.coordinates, newCoordinates));
//     if (newSquare) {
//       newSquare.piece = piece;
//     }
// }

//   export const  clearSquare(coordinates: BoardCoordinates) {
//     this.gameBoard.find(s => coordinatesEqual(s.coordinates, coordinates))!.piece = null;
//   }
// }

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