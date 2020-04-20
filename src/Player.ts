import { GamePiece } from "GamePiece";

export class Player {
  colour: PlayerColours;
  boardPieces: Array<GamePiece>;
  bagPieces: Array<GamePiece>;
  lostPieces: Array<GamePiece>;
  directionReversed: boolean;

  constructor(playerColour: PlayerColours, directionReversed: boolean = false) {
      this.colour = playerColour;
      this.boardPieces = [];
      this.bagPieces = [];
      this.lostPieces = [];
      this.directionReversed = directionReversed;
  }
}

export enum PlayerColours {
  White = 'White',
  Black = 'Black'
};

export var FirstStartingPositions = [{ x: 2, y: 5 }, { x: 3, y: 5 }];
export var SecondStartingPositions = [{ x: 2, y: 0 }, { x: 3, y: 0 }];

export const getWaitingPlayer = (players: Array<Player>, currentPlayer: Player): Player => {
  var currentPlayerIndex = players.findIndex(player => player.colour === currentPlayer.colour);
  return players[-currentPlayerIndex + 1];
}
