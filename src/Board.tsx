import React from 'react';
import { Square } from 'Square';
import './board.css';
import { Player, PlayerColours, WhiteStartingPositions, BlackStartingPositions } from 'Player';
import { BoardCoordinates } from 'GamePiece';
import { GamePhase } from 'Game';

interface IBoardProps {
    players: Player[],
    gamePhase: GamePhase,
    currentPlayer: PlayerColours,
    selectedSquare: BoardCoordinates | null,
    legalSquares: Array<BoardCoordinates>,
    clickSquare: (coordinate: BoardCoordinates) => any,
}

const coordinatesEqual = (coordinates1: BoardCoordinates, coordinates2: BoardCoordinates): boolean => {
    return coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;
}

export class Board extends React.Component <IBoardProps> {
    constructor(props: any) {
        super(props);
        this.state = {
        }

        this.selectSquare = this.selectSquare.bind(this);
    }

    findPieceOnSquare(coordinates: BoardCoordinates) {
        const player = this.props.players.find(player => player.boardPieces.find(piece => piece.position === coordinates));
        const piece = player ? player.boardPieces.find(piece => piece.position === coordinates) : null;
        return piece ? piece : null;
    }

    selectSquare(squareCoordinates: BoardCoordinates) {
        this.props.clickSquare(squareCoordinates);
    }

    createBoardRow(rowNumber: number) {
        var boardRow = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            const coordinates = {x: rowNumber, y: i};
            boardRow.push(
                <Square
                    coordinates={coordinates}
                    piece={this.findPieceOnSquare(coordinates)}
                    selected={coordinates === this.props.selectedSquare}
                    highlighted={this.props.legalSquares.some(square => coordinatesEqual(square, coordinates))}
                    clickSquare={this.selectSquare}
                />);
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