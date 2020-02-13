import React from 'react';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { BoardCoordinates, GameStage, GamePhase } from 'GameBoard';
import { Player, PlayerColours, FirstStartingPositions, SecondStartingPositions } from 'Player';

interface IGame {
    players: Player[],
    gamePhase: GamePhase,
    gameStage: GameStage,
    currentPlayer: Player,
    startPlayer: Player,
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
            selectedSquare: null,
            legalSquares: [],
            startPlayer: blackPlayer,
        }

        this.createBags = this.createBags.bind(this);
        this.startGame = this.startGame.bind(this);
        // this.selectSquare = this.selectSquare.bind(this);
        this.switchPlayers = this.switchPlayers.bind(this);
        this.updateGamePhase = this.updateGamePhase.bind(this);
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

    // TODO Does Game need selectSquare method?
    // selectSquare(squareCoordinates: BoardCoordinates) {
    //     this.setState({ ...this.state, selectedSquare: squareCoordinates, legalSquares: [] })

    //     switch(this.state.gamePhase) {
    //         case 'Setup':
    //             break;
    //         case 'Playing':
    //             return <div className='game-instruction'>{this.state.currentPlayer.colour}, make a move</div>;
    //         case 'Finished':
    //             return <div className='game-instruction'>Congratulations, {this.state.currentPlayer.colour}</div>;
    //     }
    // }

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

    updateGamePhase() {
        var { currentPlayer, startPlayer, gameStage, gamePhase } = this.state;
        var newState = this.state;
        switch(gamePhase) {
            case 'PlacingDuke':
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...this.state, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...this.state, gamePhase: 'PlacingFootsoldier1', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'PlacingFootsoldier1': 
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...this.state, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...this.state, gamePhase: 'PlacingFootsoldier2', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'PlacingFootsoldier2': 
                if (currentPlayer.colour === startPlayer.colour) {
                    newState = { ...this.state, legalSquares: SecondStartingPositions, currentPlayer: this.switchPlayers()};
                } else {
                    newState = { ...this.state, gameStage: 'Playing', gamePhase: 'ChoosingMove', currentPlayer: this.switchPlayers() };
                }
                break;
            case 'ChoosingMove':
                newState = { ...this.state, gamePhase: 'MovingPiece' };
                break;
            case null:
                switch(gameStage) {
                    case 'Start':
                        newState = { ...this.state, gameStage: 'Setup', gamePhase: 'PlacingDuke', currentPlayer: startPlayer };
                }

        }
        this.setState(newState);
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
                        selectedSquare={this.state.selectedSquare}
                        legalSquares={this.state.legalSquares}
                        // clickSquare={this.selectSquare}
                        updateGamePhase={this.updateGamePhase}
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
