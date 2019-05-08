import React from 'react';
import * as ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import { Piece } from './Piece';

interface IPieceSet {
    pieces: Piece[]
}

interface IGame {
    players: Player[]
}

var startingPieces = ["Duke", "Footsoldier", "Footsoldier"]
var initialBagPieces = ["Pikeman", "Arbalist", "Champion"]

export class Player {
    constructor(playerColour: string) {
        var colour = playerColour;
        var boardPieces = startingPieces;
        var bagPieces = initialBagPieces;
        var lostPieces = [];
    }
}

class Game extends React.Component <{}, IGame> {
    constructor(props: any) {
        super(props)
        this.state = {
            players: []
        }
    }

    initiatePlayers() {
        var players = new Array<Player>();
        ["white", "black"].forEach(colour => {
            var player = new Player(colour);
            players.push(player);
        });
        this.setState({
            players: players
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board  players={this.state.players}/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

export default Game;
