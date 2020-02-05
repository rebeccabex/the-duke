import React from 'react';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { BoardCoordinates } from 'GameBoard';
import { Player, PlayerColours, WhiteStartingPositions, BlackStartingPositions } from 'Player';

interface IGame {
    players: Player[],
    gamePhase: GamePhase,
    currentPlayer: Player,
    startPlayer: Player,
    selectedSquare: BoardCoordinates | null,
    legalSquares: Array<BoardCoordinates>,
}

export type GamePhase = 'Start' | 'Setup' | 'Playing' | 'Finished';

class Game extends React.Component <{}, IGame> {

    constructor(props: any) {
        var whitePlayer = new Player(PlayerColours.White);
        var blackPlayer = new Player(PlayerColours.Black);

        super(props)
        this.state = {
            players: [whitePlayer, blackPlayer],
            gamePhase: 'Start',
            currentPlayer: blackPlayer,
            selectedSquare: null,
            legalSquares: [],
            startPlayer: blackPlayer,
        }

        this.createBags = this.createBags.bind(this);
        this.startGame = this.startGame.bind(this);
        this.selectSquare = this.selectSquare.bind(this);
        this.switchPlayers = this.switchPlayers.bind(this);
        this.updateGamePhase = this.updateGamePhase.bind(this);
    }

    startGame() {
        this.setState({ ...this.state, gamePhase: 'Setup', legalSquares: WhiteStartingPositions, currentPlayer: this.state.startPlayer });
    };

    selectSquare(squareCoordinates: BoardCoordinates) {
        this.setState({ ...this.state, selectedSquare: squareCoordinates, legalSquares: [] })

        switch(this.state.gamePhase) {
            case 'Setup':
                break;
            case 'Playing':
                return <div className='game-instruction'>{this.state.currentPlayer.colour}, make a move</div>;
            case 'Finished':
                return <div className='game-instruction'>Congratulations, {this.state.currentPlayer.colour}</div>;
        }
    }

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

    setGameControls(gamePhase: GamePhase) {
        switch(gamePhase) {
            case 'Start':
                return <button className="start-button" onClick={this.startGame}>{'Start game'}</button>;
            case 'Setup':
                return <div className='game-instruction'>{this.state.currentPlayer.colour}, select your starting position</div>;
            case 'Playing':
                return <div className='game-instruction'>{this.state.currentPlayer.colour}, make a move</div>;
            case 'Finished':
                return <div className='game-instruction'>Congratulations, {this.state.currentPlayer.colour}</div>;
        }
    }

    updateGamePhase(currentGamePhase: GamePhase) {
        var { currentPlayer, startPlayer } = this.state;
        switch(currentGamePhase) {
            case 'Setup':
                if (currentPlayer.colour === startPlayer.colour) {
                    this.setState({ ...this.state, legalSquares: BlackStartingPositions, currentPlayer: this.switchPlayers()});
                } else {
                    this.setState({ ...this.state, gamePhase: 'Playing', currentPlayer: this.switchPlayers() });
                }
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        players={this.state.players}
                        gamePhase={this.state.gamePhase}
                        currentPlayer={this.state.currentPlayer}
                        selectedSquare={this.state.selectedSquare}
                        legalSquares={this.state.legalSquares}
                        clickSquare={this.selectSquare}
                        updateGamePhase={this.updateGamePhase}
                    />
                </div>
                <div className="game-info">
                    {this.createBags()}
                </div>
                <div className="game-controls">
                    {this.setGameControls(this.state.gamePhase)}
                </div>
            </div>
        );
    }
}

export default Game;
