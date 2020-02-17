import React from 'react';
import { PlayerPiece } from 'GamePiece';
import './tile.css';

interface ITileProps {
  piece: PlayerPiece;
  selected: boolean,
  clickable: boolean,
  onClick: () => any,
}

export const Tile = (props: ITileProps) => {
  const tileClassName = props.selected
    ? `button ${props.piece.player.colour} tile-selected`
    : props.clickable 
      ? `button ${props.piece.player.colour} tile-clickable`
      : `button ${props.piece.player.colour} tile-normal`;

  const orientation = props.piece.piece.isFlipped ? "R" : "I";

  return(
    <button className={tileClassName}>{`${props.piece.piece.name} ${orientation}`}</button>
  )
}
