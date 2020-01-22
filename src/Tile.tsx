import React from 'react';
import { PlayerPiece } from 'GamePiece';
import './square.css';

interface ITileProps {
    piece: PlayerPiece;
    selected: boolean,
}

export const Tile = (props: ITileProps) => {
    const tileClassName = props.selected
        ? `button ${props.piece.player.colour} tile-selected`
        : `button ${props.piece.player.colour} tile-normal`;

    return(
        <button className={tileClassName}>{props.piece.piece.name}</button>
    )
}
