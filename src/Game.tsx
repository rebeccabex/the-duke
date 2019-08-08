import React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { GamePiece } from 'GamePiece';

interface IGame {
    players: Player[]
}

var duke = new GamePiece("Duke", {x: 5, y: 2});
var footsoldier1 = new GamePiece("Footsoldier", {x: 5, y: 3});
var footsoldier2 = new GamePiece("Footsoldier", {x: 4, y: 2});

var startingPieces = [duke, footsoldier1, footsoldier2]
var initialBagPieces = new Array();

export class Player {
    colour: string;
    boardPieces: Array<GamePiece>;
    bagPieces: Array<GamePiece>;
    lostPieces: Array<GamePiece>;

    constructor(playerColour: string) {
        this.colour = playerColour;
        this.boardPieces = startingPieces;
        this.bagPieces = initialBagPieces;
        this.lostPieces = [];
    }
}

class Game extends React.Component <{}, IGame> {
    constructor(props: any) {
        super(props)
        this.state = {
            players: []
        }

        this.createBags = this.createBags.bind(this);
    }

    componentDidMount() {
        var players = new Array<Player>();
        ["White", "Black"].forEach(colour => {
            var player = new Player(colour);
            players.push(player);
        });
        this.setState({
            players: players
        });
    }

    createBags() {
        var bags = new Array<JSX.Element>();
        this.state.players.forEach(player => {
            bags.push(<Bag colour={player.colour} pieces={player.bagPieces}></Bag>);
        });
        return <div>{bags}</div>;
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board players={this.state.players}/>
                </div>
                <div className="game-info">
                    {this.createBags()}
                </div>
            </div>
        );
    }
}

export default Game;
