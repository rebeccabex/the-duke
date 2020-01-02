import React from 'react';
import { GamePiece } from 'GamePiece';
import './square.css';

interface ITileProps {
    piece: GamePiece;
    selected: boolean,
}

export const Tile = (props: ITileProps) => {
    const tileClassName = props.selected ? 'tile-selected' : 'tile-normal';

    return(
        <button className={tileClassName}>{props.piece.name}</button>
    )
}
