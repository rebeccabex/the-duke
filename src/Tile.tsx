import React from 'react';
import { GamePiece } from 'GamePiece';
import './tile.css';

interface ITileProps {
  piece: GamePiece;
  selected: boolean,
  clickable: boolean,
  onClick: () => any,
}

export const Tile = (props: ITileProps) => {
  const tileClassName = props.selected
    ? `button ${props.piece.colour} tile-selected`
    : props.clickable 
      ? `button ${props.piece.colour} tile-clickable`
      : `button ${props.piece.colour} tile-normal`;

  const orientation = props.piece.isFlipped ? "R" : "I";

  return(
    <button className={tileClassName} onClick={props.onClick}>{`${props.piece.name} ${orientation}`}</button>
  )
}
