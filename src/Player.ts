import { GamePiece } from "GamePiece";

export class Player {
  colour: PlayerColours;
  boardPieces: Array<GamePiece>;
  bagPieces: Array<GamePiece>;
  lostPieces: Array<GamePiece>;

  constructor(playerColour: PlayerColours) {
      this.colour = playerColour;
      this.boardPieces = startingPieces;
      this.bagPieces = initialBagPieces;
      this.lostPieces = [];
  }
}

export enum PlayerColours {
  White = 'White', 
  Black = 'Black'
};

export var WhiteStartingPositions = [{ x: 5, y: 2 }, { x: 5, y: 3 }];
export var BlackStartingPositions = [{ x: 0, y: 2 }, { x: 0, y: 3 }];

var duke = new GamePiece("Duke", {x: 5, y: 2});
var footsoldier1 = new GamePiece("Footsoldier", {x: 5, y: 3});
var footsoldier2 = new GamePiece("Footsoldier", {x: 4, y: 2});

var startingPieces = [duke, footsoldier1, footsoldier2]
var initialBagPieces = new Array();
