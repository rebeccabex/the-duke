import React from 'react';
import './square.css';
import { PlayerPiece } from 'GamePiece';
import { BoardCoordinates } from 'GameBoard';
import { Tile } from 'Tile';

interface ISquareProps {
    coordinates: BoardCoordinates;
    piece: PlayerPiece | null;
    selected: boolean;
    highlighted: boolean;
    clickSquare: (coordinates: BoardCoordinates) => any;
}

export const Square = (props: ISquareProps) => {
  const clickThisSquare = (): any => {
    props.clickSquare(props.coordinates);
  };

  return (
    props.piece
    ? <Tile piece={props.piece} selected={props.selected} />
    : props.highlighted
      ? <button className="square-highlighted" onClick={clickThisSquare}>
          {props.coordinates.x + "," + props.coordinates.y}
        </button>
      : <div className="square-plain">{props.coordinates.x + "," + props.coordinates.y}</div>
  )
}