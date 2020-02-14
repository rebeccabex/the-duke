import React from 'react';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { BoardCoordinates, GameStage, GamePhase, GameBoard, coordinatesEqual, createGameBoard } from 'GameBoard';
import { Player, PlayerColours, FirstStartingPositions, SecondStartingPositions } from 'Player';
import { GamePiece, PlayerPiece } from 'GamePiece';

interface IGame {
    players: Player[],
    gamePhase: GamePhase,
    gameStage: GameStage,
    currentPlayer: Player,
    startPlayer: Player,
    gameBoard: GameBoard,
    selectedSquare: BoardCoordinates | null,
    legalSquares: Array<BoardCoordinates>,
}

class Game extends React.Component <{}, IGame> {

    constructor(props: any) {
        var whitePlayer = new Player(PlayerColours.White);
        var blackPlayer = new Player(PlayerColours.Black);

        super(props)
        this.state = {
            players: [whitePlayer, blackPlayer],
            gameStage: 'Start',
            gamePhase: null,
            currentPlayer: blackPlayer,
            gameBoard: createGameBoard(),
            selectedSquare: null,
            legalSquares: [],
            startPlayer: blackPlayer,
        }

        this.createBags = this.createBags.bind(this);
        this.startGame = this.startGame.bind(this);
        this.selectSquare = this.selectSquare.bind(this);
        this.switchPlayers = this.switchPlayers.bind(this);
        this.updateGamePhase = this.updateGamePhase.bind(this);
        this.placePiece = this.placePiece.bind(this);
    }

    startGame() {
        this.setState({
            ...this.state,
            gameStage: 'Setup',
            gamePhase: 'PlacingDuke',
            legalSquares: FirstStartingPositions,
            currentPlayer: this.state.startPlayer
        });
    };

    switchPlayers() {
        var currentPlayerIndex = this.state.players.findIndex(player => player.colour === this.state.currentPlayer.colour);
        return this.state.players[-currentPlayerIndex + 1];
    }

    createBags() {
        var bags = new Array<JSX.Element>();
        this.state.players.forEach(player => {
            bags.push(<Bag colour={player.colour} pieces={player.bagPieces}></Bag>);
        });
        return <div>{bags}</div>;
    }

    setGameControls() {
        var gameInstruction = '';
        switch(this.state.gameStage) {
            case 'Start':
                return <button className="start-button" onClick={this.startGame}>{'Start game'}</button>;
            case 'Setup':
                switch(this.state.gamePhase) {
                    case 'PlacingDuke':
                        gameInstruction = `${this.state.currentPlayer.colour}, choose where to place your Duke`;
                        break;
                    case 'PlacingFootsoldier1':
                    case 'PlacingFootsoldier2':
                        gameInstruction = `${this.state.currentPlayer.colour}, choose where to place your Footsoldier`;
                }
                break;
            case 'Playing':
                switch(this.state.gamePhase) {
                    case 'ChoosingMove':
                        gameInstruction = `${this.state.currentPlayer.colour}, select your starting position`;
                        break;
                    case 'MovingPiece':
                        gameInstruction = `${this.state.currentPlayer.colour}, make a move`;
                        break;
                    case 'PlacingPiece': 
                        gameInstruction = `${this.state.currentPlayer.colour}, choose where to place your piece`;
                        break;
                }
            case 'Finished':
                gameInstruction = `Congratulations, ${this.state.currentPlayer.colour}`;
        }
        return <div className='game-instruction'>{gameInstruction}</div>;
    }

    getLegalPlacingSquares(dukePosition: BoardCoordinates) {
        // TODO Return cells that are on the board and unoccupied
    }

    updateGamePhase(newState: IGame = this.state) {
        var { currentPlayer, startPlayer, gameStage, gamePhase } = this.state;
        switch(gamePhase) {
            case 'PlacingDuke':
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...newState, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...newState, gamePhase: 'PlacingFootsoldier1', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'PlacingFootsoldier1': 
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...newState, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...newState, gamePhase: 'PlacingFootsoldier2', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'PlacingFootsoldier2': 
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...newState, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...newState, gameStage: 'Playing', gamePhase: 'ChoosingMove', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'ChoosingMove':
                newState = { ...newState, gamePhase: 'MovingPiece' };
                break;
            case null:
                switch(gameStage) {
                    case 'Start':
                        newState = { ...newState, gameStage: 'Setup', gamePhase: 'PlacingDuke', currentPlayer: startPlayer };
                }
        }
        this.setState(newState);
    }

    getPieceOnSquare(coordinates: BoardCoordinates): PlayerPiece | null {
        var squareOrUndefined = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, coordinates));
        return (squareOrUndefined === undefined || squareOrUndefined === null ? null : squareOrUndefined.piece);
    }

    selectSquare(squareCoordinates: BoardCoordinates) {
        switch(this.state.gamePhase) {
            case 'PlacingDuke':
                this.placePiece(new GamePiece('Duke'), this.state.currentPlayer, squareCoordinates);
                break;
            case 'PlacingFootsoldier1':
            case 'PlacingFootsoldier2':
                this.placePiece(new GamePiece('Footsoldier'), this.state.currentPlayer, squareCoordinates);
        }
    }

    placePiece(gamePiece: GamePiece, player: Player, squareCoordinates: BoardCoordinates) {
        var pieceToPlace: PlayerPiece = { player, piece: gamePiece };

        var newState = {
            ...this.state,
            gameBoard: this.state.gameBoard.map((square) =>
                coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: pieceToPlace} : square)
        };
        this.updateGamePhase(newState);
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        players={this.state.players}
                        gamePhase={this.state.gamePhase}
                        gameStage={this.state.gameStage}
                        currentPlayer={this.state.currentPlayer}
                        gameBoard={this.state.gameBoard}
                        selectedSquare={this.state.selectedSquare}
                        legalSquares={this.state.legalSquares}
                        clickSquare={this.selectSquare}
                    />
                </div>
                <div className="game-info">
                    {this.createBags()}
                </div>
                <div className="game-controls">
                    {this.setGameControls()}
                </div>
            </div>
        );
    }
}

export default Game;
