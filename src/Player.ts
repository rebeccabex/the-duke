import { GamePiece } from "GamePiece";

export class Player {
  colour: PlayerColours;
  boardPieces: Array<GamePiece>;
  bagPieces: Array<GamePiece>;
  lostPieces: Array<GamePiece>;

  constructor(playerColour: PlayerColours) {
      this.colour = playerColour;
      this.boardPieces = [];
      this.bagPieces = [];
      this.lostPieces = [];
  }
}

export enum PlayerColours {
  White = 'White',
  Black = 'Black'
};

export var FirstStartingPositions = [{ x: 5, y: 2 }, { x: 5, y: 3 }];
export var SecondStartingPositions = [{ x: 0, y: 2 }, { x: 0, y: 3 }];
