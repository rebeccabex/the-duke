import React from 'react';
import { GamePiece } from 'GamePiece';
import './square.css';

interface ITileProps {
    piece: GamePiece;
    selected: boolean,
}

export const Tile = (props: ITileProps) => {
    return(
        props.selected
        ? <button className="tile-selected">{props.piece.name}</button>
        : <button className="tile-normal">{props.piece.name}</button>
    )
}
