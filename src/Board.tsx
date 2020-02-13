import React from 'react';
import { Square } from 'Square';
import './board.css';
import { Player } from 'Player';
import { BoardCoordinates, GameBoard, BoardSquare, GameStage, GamePhase } from 'GameBoard';
import { PlayerPiece, GamePiece } from 'GamePiece';

interface IBoardProps {
    players: Player[],
    gameStage: GameStage,
    gamePhase: GamePhase,
    currentPlayer: Player,
    selectedSquare: BoardCoordinates | null,
    legalSquares: Array<BoardCoordinates>,
    // clickSquare: (coordinate: BoardCoordinates) => any,
    updateGamePhase: (currentGamePhase: GameStage) => any,
}

interface IBoardState {
    gameBoard: GameBoard,
}

const coordinatesEqual = (coordinates1: BoardCoordinates, coordinates2: BoardCoordinates): boolean => {
    return coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;
}

export class Board extends React.Component <IBoardProps, IBoardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameBoard: this.createGameBoard(),
        }

        this.selectSquare = this.selectSquare.bind(this);
    }

    createGameBoard() {
        var newGameBoard = new Array<BoardSquare>();
        for (let i = 0; i < 6 ; i++) {
            for (let j = 0; j < 6; j++) {
                var boardSquare: BoardSquare = { coordinates: {x: i, y: j}, piece: null};
                newGameBoard.push(boardSquare);
            }
        }
        return newGameBoard;
    }

    getPieceOnSquare = (coordinates: BoardCoordinates): PlayerPiece | null => {
        var squareOrUndefined = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, coordinates));
        return (squareOrUndefined === undefined || squareOrUndefined === null ? null : squareOrUndefined.piece);
    }

    selectSquare(squareCoordinates: BoardCoordinates) {
        switch(this.props.gamePhase) {
            case 'PlacingDuke':
                this.placePiece(new GamePiece('Duke'), this.props.currentPlayer, squareCoordinates);
                break;
            case 'PlacingFootsoldier1':
            case 'PlacingFootsoldier2':
                this.placePiece(new GamePiece('Footsoldier'), this.props.currentPlayer, squareCoordinates);
        }
    }

    createBoardRow(rowNumber: number) {
        var boardRow = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            const coordinates = {x: i, y: rowNumber};
            boardRow.push(
                <Square
                    coordinates={coordinates}
                    piece={this.getPieceOnSquare(coordinates)}
                    selected={coordinates === this.props.selectedSquare}
                    highlighted={this.props.legalSquares.some(square => coordinatesEqual(square, coordinates))}
                    clickSquare={this.selectSquare}
                    currentGamePhase={this.props.gamePhase}
                    currentGameStage={this.props.gameStage}
                    currentPlayer={this.props.currentPlayer}
                    key={6 * rowNumber + i}
                />);
        }
        return boardRow;
    }

    createBoard() {
        var board = new Array<JSX.Element>();
        for (var i = 0; i < 6; i++) {
            board.push(<div className="board-row" key={i}>{this.createBoardRow(i)}</div>);
        }
        return board;
    }

    placePiece(gamePiece: GamePiece, player: Player, squareCoordinates: BoardCoordinates) {
        var pieceToPlace: PlayerPiece = { player, piece: gamePiece };

        this.setState({
            ...this.state,
            gameBoard: this.state.gameBoard.map((square) =>
                coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: pieceToPlace} : square)
        });
        this.props.updateGamePhase(this.props.gameStage);
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        )
    }
}