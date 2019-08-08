import React from 'react';
import { render } from 'react-dom';
import { GamePiece } from 'GamePiece';

interface IBagProps {
    colour: string,
    pieces: GamePiece[]
}

export class Bag extends React.Component <IBagProps> {
    constructor(props: any) {
        super(props);

        this.displayBagPieces = this.displayBagPieces.bind(this);
    }

    displayBagPieces() {
        var pieces = new Array<JSX.Element>();
        this.props.pieces.forEach(piece => {
            pieces.push(<div>{piece}</div>);
        });
        return <div>{pieces}</div>;
    }

    render() {
        return(
            <div>
                <h4>{this.props.colour}'s Bag</h4>
                <div>{this.displayBagPieces()}</div>
            </div>
        )
    }
}