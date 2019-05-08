import React from 'react';
import { Square } from 'Square';
import './board.css';
import { Player } from 'Game';

interface IBoardProps {
    players: Player[]
}


export class Board extends React.Component <IBoardProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
        <div>
            <div className="board-row">
                <Square coordinates={[0, 0]}/>
                <Square coordinates={[0, 1]}/>
                <Square coordinates={[0, 2]}/>
                <Square coordinates={[0, 3]}/>
                <Square coordinates={[0, 4]}/>
                <Square coordinates={[0, 5]}/>
            </div>
            <div className="board-row">
                <Square coordinates={[1, 0]}/>
                <Square coordinates={[1, 1]}/>
                <Square coordinates={[1, 2]}/>
                <Square coordinates={[1, 3]}/>
                <Square coordinates={[1, 4]}/>
                <Square coordinates={[1, 5]}/>
            </div>
            <div className="board-row">
                <Square coordinates={[2, 0]}/>
                <Square coordinates={[2, 1]}/>
                <Square coordinates={[2, 2]}/>
                <Square coordinates={[2, 3]}/>
                <Square coordinates={[2, 4]}/>
                <Square coordinates={[2, 5]}/>
            </div>
            <div className="board-row">
                <Square coordinates={[3, 0]}/>
                <Square coordinates={[3, 1]}/>
                <Square coordinates={[3, 2]}/>
                <Square coordinates={[3, 3]}/>
                <Square coordinates={[3, 4]}/>
                <Square coordinates={[3, 5]}/>
            </div>
            <div className="board-row">
                <Square coordinates={[4, 0]}/>
                <Square coordinates={[4, 1]}/>
                <Square coordinates={[4, 2]}/>
                <Square coordinates={[4, 3]}/>
                <Square coordinates={[4, 4]}/>
                <Square coordinates={[4, 5]}/>
            </div>
            <div className="board-row">
                <Square coordinates={[5, 0]}/>
                <Square coordinates={[5, 1]}/>
                <Square coordinates={[5, 2]}/>
                <Square coordinates={[5, 3]}/>
                <Square coordinates={[5, 4]}/>
                <Square coordinates={[5, 5]}/>
            </div>
        </div>
    )
  }
}