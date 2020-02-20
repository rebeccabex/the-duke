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

export var FirstStartingPositions = [{ x: 2, y: 5 }, { x: 3, y: 5 }];
export var SecondStartingPositions = [{ x: 2, y: 0 }, { x: 3, y: 0 }];
