import React from 'react';
import { GamePiece } from 'GamePiece';
import './square.css';

interface ITileProps {
    piece: GamePiece;
}

export class Tile extends React.Component <ITileProps> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return(
            <button className="square">{this.props.piece.name}</button>
        )
    }
}
