import React from 'react';
import { Square } from 'Square';
import './board.css';
import { Player } from 'Player';
import { BoardCoordinates, GameBoard, GameStage, GamePhase } from 'GameBoard';

interface IBoardProps {
    gameBoard: GameBoard,
    players: Player[],
    gameStage: GameStage,
    gamePhase: GamePhase,
    currentPlayer: Player,
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

    }

    renderBoardRow(rowNumber: number) {
        var boardRow = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            const square = this.props.gameBoard.find(boardSquare => coordinatesEqual(boardSquare.coordinates, {x: rowNumber, y: i}));
            square && boardRow.push(
                <Square
                    coordinates={square.coordinates}
                    piece={square.piece}
                    selected={square.coordinates === this.props.selectedSquare}
                    highlighted={this.props.legalSquares.some(legalSquare => coordinatesEqual(legalSquare, square.coordinates))}
                    clickSquare={this.props.clickSquare}
                    currentGamePhase={this.props.gamePhase}
                    currentGameStage={this.props.gameStage}
                    currentPlayer={this.props.currentPlayer}
                    key={6 * rowNumber + i}
                />);
        }
        return boardRow;
    }

    renderBoard() {
        var board = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            board.push(<div className="board-row" key={i}>{this.renderBoardRow(i)}</div>);
        }
        return board;
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        )
    }
}