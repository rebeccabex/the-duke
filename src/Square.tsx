import React from 'react';
import './square.css';
import { GamePiece } from 'GamePiece';
import { BoardCoordinates } from 'GameBoard';
import { GameStage, GamePhase } from 'GamePhases';
import { Tile } from 'Tile';
import { Player } from 'Player';

interface ISquareProps {
    coordinates: BoardCoordinates;
    piece: GamePiece | null;
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

  return (
    <div className="square-plain">
      {props.piece
      ? <Tile
          piece={props.piece}
          selected={props.selected}
          clickable={props.highlighted}
          onClick={clickThisSquare}
        />
      : props.highlighted
        ? <button className="square-highlighted" onClick={clickThisSquare}>
            {props.coordinates.x + "," + props.coordinates.y}
          </button>
        : <div className="square-plain">{props.coordinates.x + "," + props.coordinates.y}</div>
      }
    </div>
  )
}