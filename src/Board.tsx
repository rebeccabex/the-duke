import React from 'react';
import { Square } from 'Square';
import './board.css';

export class Board extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
        <div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
        </div>
    )
  }
}