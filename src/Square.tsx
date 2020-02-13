import React from 'react';
import './square.css';
import { PlayerPiece } from 'GamePiece';
import { BoardCoordinates, coordinatesInSelection, GameStage, GamePhase } from 'GameBoard';
import { Tile } from 'Tile';
import { Player, FirstStartingPositions, SecondStartingPositions } from 'Player';

interface ISquareProps {
    coordinates: BoardCoordinates;
    piece: PlayerPiece | null;
    selected: boolean;
    highlighted: boolean;
    clickSquare: (coordinates: BoardCoordinates) => any;
    currentGameStage: GameStage,
    currentGamePhase: GamePhase,
    currentPlayer: Player,
}

export const Square = (props: ISquareProps) => {
  const clickThisSquare = (): any => {
    props.clickSquare(props.coordinates);
  };

  const isSquareHighlighted = (): boolean => {
    const { currentGamePhase, currentPlayer, piece, coordinates, highlighted } = props;
    const firstPositions = FirstStartingPositions;
    const secondPositions = SecondStartingPositions;
    switch(currentGamePhase) {
      case 'PlacingDuke':
      case 'PlacingFootsoldier1':
      case 'PlacingFootsoldier2':
        if (currentPlayer.colour === 'Black') {
          return coordinatesInSelection(firstPositions, coordinates);
        } else {
          return coordinatesInSelection(secondPositions, coordinates);
        }
      case 'ChoosingMove':
        return piece === null ? false : piece.player.colour === currentPlayer.colour;
      default:
        return highlighted;
    }
  }

  const squareIsHighlighted = isSquareHighlighted();
  
  return (
    <div className="square-plain">
      {props.piece
      ? <Tile
          piece={props.piece}
          selected={props.selected}
          clickable={squareIsHighlighted}
          onClick={clickThisSquare}
        />
      : squareIsHighlighted
        ? <button className="square-highlighted" onClick={clickThisSquare}>
            {props.coordinates.x + "," + props.coordinates.y}
          </button>
        : <div className="square-plain">{props.coordinates.x + "," + props.coordinates.y}</div>
      }
    </div>
  )
}