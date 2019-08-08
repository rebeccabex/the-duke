import React from 'react';
import { Square } from 'Square';
import './board.css';
import { Player } from 'Game';
import { BoardCoordinates } from 'GamePiece';

interface IBoardProps {
    players: Player[]
}


export class Board extends React.Component <IBoardProps> {
        constructor(props: any) {
        super(props);
    }

    findPieceOnSquare(coordinates: BoardCoordinates) {
        const player = this.props.players.find(player => player.boardPieces.find(piece => piece.position === coordinates));
        const piece = player ? player.boardPieces.find(piece => piece.position === coordinates) : null;
        return piece ? piece : null;
    }

    createBoardRow(rowNumber: number) {
        var boardRow = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            const coordinates = {x: rowNumber, y: i};
            boardRow.push(<Square coordinates={coordinates} piece={this.findPieceOnSquare(coordinates)} />);
        }
        return boardRow;
    }

    createBoard() {
        var board = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            board.push(<div className="board-row">{this.createBoardRow(i)}</div>);
        }
        return board;
    }

  render() {
    return (
        <div>
            {this.createBoard()}
        </div>
    )
  }
}