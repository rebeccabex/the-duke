import React from 'react';
import './square.css';
import { BoardCoordinates, GamePiece } from 'GamePiece';
import { Tile } from 'Tile';

interface ISquareProps {
    coordinates: BoardCoordinates;
    piece: GamePiece | null;
}

export class Square extends React.Component <ISquareProps> {
  constructor(props: any) {
    super(props)
  }

  render() {

    return(
      this.props.piece
      ? <Tile piece={this.props.piece}/>
      : <div className="square">{this.props.coordinates.x + "," + this.props.coordinates.y}</div>
    )
  }
}