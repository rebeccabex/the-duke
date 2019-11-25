import React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { BoardCoordinates, GamePiece } from 'GamePiece';
import { Player, PlayerColours, WhiteStartingPositions, BlackStartingPositions } from 'Player';
import { thisTypeAnnotation } from '@babel/types';

interface IGame {
    players: Player[],
    gamePhase: GamePhase,
    currentPlayer: PlayerColours,
    selectedSquare: BoardCoordinates | null,
    legalSquares: Array<BoardCoordinates>,
}

export type GamePhase = 'Start' | 'Setup' | 'Playing' | 'Finished';

class Game extends React.Component <{}, IGame> {
    constructor(props: any) {
        super(props)
        this.state = {
            players: [],
            gamePhase: 'Start',
            currentPlayer: PlayerColours.White,
            selectedSquare: null,
            legalSquares: [],
        }

        this.createBags = this.createBags.bind(this);
        this.startGame = this.startGame.bind(this);
        this.selectSquare = this.selectSquare.bind(this);
    }

    componentDidMount() {
        var players = new Array<Player>();
        var players = [new Player(PlayerColours.White), new Player(PlayerColours.Black)];
        this.setState({
            players: players
        });
    }

    startGame() {
        this.setState({ ...this.state, gamePhase: 'Setup', legalSquares: WhiteStartingPositions });
    };

    selectSquare(squareCoordinates: BoardCoordinates) {
        this.setState({ ...this.state, selectedSquare: squareCoordinates, legalSquares: [] })
        switch(this.state.gamePhase) {
            case 'Setup':
                this.placePiece('Duke', squareCoordinates);
            case 'Playing':
                return <div className='game-instruction'>{this.state.currentPlayer}, make a move</div>;
            case 'Finished':
                return <div className='game-instruction'>Congratulations, {this.state.currentPlayer}</div>;
        }
    }

    placePiece(pieceName: string, squareCoordinates: BoardCoordinates) {
        var piece = new GamePiece(pieceName, squareCoordinates);

        this.setState({
            ...this.state,
            players: this.state.players.map((player) =>
                player.colour === this.state.currentPlayer
                ? { ...player, boardPieces: [ ...player.boardPieces, piece ] }
                : player
            )
        })
        this.switchPlayers();
    }

    switchPlayers() {
        this.setState({ ...this.state, currentPlayer: this.state.currentPlayer === PlayerColours.White ? PlayerColours.Black : PlayerColours.White })
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
                return <div className='game-instruction'>{this.state.currentPlayer}, select your starting position</div>;
            case 'Playing':
                return <div className='game-instruction'>{this.state.currentPlayer}, make a move</div>;
            case 'Finished':
                return <div className='game-instruction'>Congratulations, {this.state.currentPlayer}</div>;
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
