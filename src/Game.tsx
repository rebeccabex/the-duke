import React from 'react';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import {
  BoardCoordinates,
  GameStage,
  GamePhase,
  GameBoard,
  coordinatesEqual,
  createGameBoard,
  getOrthogonallyAdjacentSquares,
  BoardSquare,
  getAvailableMoveSquares
} from 'GameBoard';
import { Player, PlayerColours, FirstStartingPositions, SecondStartingPositions } from 'Player';
import { GamePiece, PlayerPiece } from 'GamePiece';
import { Duke, Footsoldier } from 'PieceData';

interface IGame {
  players: Player[],
  gamePhase: GamePhase,
  gameStage: GameStage,
  currentPlayer: Player,
  startPlayer: Player,
  gameBoard: GameBoard,
  selectedSquare: BoardSquare | null,
  legalSquares: Array<BoardCoordinates>,
}

class Game extends React.Component <{}, IGame> {

  constructor(props: any) {
    var whitePlayer = new Player(PlayerColours.White, false);
    var blackPlayer = new Player(PlayerColours.Black, true);

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
    this.getWaitingPlayer = this.getWaitingPlayer.bind(this);
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

  getWaitingPlayer() {
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
            gameInstruction = `${this.state.currentPlayer.colour}, make a move or draw from your bag`;
            break;
          case 'MovingPiece':
            gameInstruction = `${this.state.currentPlayer.colour}, make a move`;
            break;
          case 'PlacingPiece': 
            gameInstruction = `${this.state.currentPlayer.colour}, choose where to place your piece`;
            break;
        }
        break;
      case 'Finished':
        gameInstruction = `Congratulations, ${this.state.currentPlayer.colour}`;
    }
    return <div className='game-instruction'>{gameInstruction}</div>;
  }

  getPieceOnSquare(coordinates: BoardCoordinates): PlayerPiece | null {
    var squareOrUndefined = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, coordinates));
    return (squareOrUndefined === undefined || squareOrUndefined === null ? null : squareOrUndefined.piece);
  }

  isEmptySquare(coordinates: BoardCoordinates): Boolean {
    return this.getPieceOnSquare(coordinates) === null;
  }

  getLegalPlacingSquares(newState: IGame = this.state) {
    const dukePosition = newState.gameBoard.find(
      square => square.piece && square.piece.piece.name === 'Duke' && square.piece.player === this.getWaitingPlayer());

    if (!!!dukePosition) {
      return [];
    }

    const orthogSquares = getOrthogonallyAdjacentSquares(dukePosition.coordinates);
    return orthogSquares.filter(square => this.isEmptySquare(square));
  }

  // TODO: Filter out pieces that can't currently move
  getSquaresWithCurrentPlayersPieces(newState: IGame = this.state, switchPlayers: boolean = false) {
    const playerColour = switchPlayers ? this.getWaitingPlayer().colour : newState.currentPlayer.colour;
    return newState.gameBoard
      .filter(square => square.piece && square.piece.player.colour === playerColour)
      .map(square => square.coordinates);
  }

  getLegalPieceMovingSquares(newState: IGame = this.state) {
    const { selectedSquare } = newState;
    if (!!selectedSquare) {
      const selectedPiece = selectedSquare.piece;
      if (!!selectedPiece) {
        const currentMoveSet = selectedPiece.piece.isFlipped ? selectedPiece.piece.flippedMoveSet: selectedPiece.piece.initialMoveSet;
        return getAvailableMoveSquares(currentMoveSet, selectedSquare, newState.gameBoard, newState.currentPlayer);
      }
    }
    console.log('No piece selected');
    return new Array<BoardCoordinates>();
  }

  updateGamePhase(newState: IGame = this.state) {
    var { currentPlayer, startPlayer, gameStage, gamePhase } = newState;
    switch(gamePhase) {
      case 'PlacingDuke':
        if (currentPlayer.colour === startPlayer.colour) {
          newState = { ...newState, legalSquares: SecondStartingPositions, currentPlayer: this.getWaitingPlayer()};
        } else {
          newState = { ...newState, gamePhase: 'PlacingFootsoldier1', legalSquares: this.getLegalPlacingSquares(newState), currentPlayer: this.getWaitingPlayer() };
        }
        break;
      case 'PlacingFootsoldier1': 
        if (currentPlayer.colour === startPlayer.colour) {
          newState = { ...newState, legalSquares: this.getLegalPlacingSquares(), currentPlayer: this.getWaitingPlayer()};
        } else {
          newState = { ...newState, gamePhase: 'PlacingFootsoldier2', legalSquares: this.getLegalPlacingSquares(newState), currentPlayer: this.getWaitingPlayer() };
        }
        break;
      case 'PlacingFootsoldier2': 
        if (currentPlayer.colour === startPlayer.colour) {
          newState = { ...newState, legalSquares: this.getLegalPlacingSquares(), currentPlayer: this.getWaitingPlayer()};
        } else {
          newState = {
            ...newState,
            gameStage: 'Playing',
            gamePhase: 'ChoosingMove',
            legalSquares: this.getSquaresWithCurrentPlayersPieces(newState, true),
            currentPlayer: this.getWaitingPlayer(),
          };
        }
        break;
      case 'ChoosingMove':
        newState = { ...newState, gamePhase: 'MovingPiece', legalSquares: this.getLegalPieceMovingSquares(newState) };
        break;
      case 'MovingPiece':
        newState = { ...newState, gamePhase: 'ChoosingMove', legalSquares: this.getSquaresWithCurrentPlayersPieces(newState) };
        break;
      case null:
        switch(gameStage) {
          case 'Start':
            newState = { ...newState, gameStage: 'Setup', gamePhase: 'PlacingDuke', currentPlayer: startPlayer };
        }
    }
    this.setState(newState);
  }

  selectSquare(squareCoordinates: BoardCoordinates) {
    switch(this.state.gamePhase) {
      case 'PlacingDuke':
        this.placePiece(new Duke(), this.state.currentPlayer, squareCoordinates);
        break;
      case 'PlacingFootsoldier1':
      case 'PlacingFootsoldier2':
        this.placePiece(new Footsoldier(), this.state.currentPlayer, squareCoordinates);
        break;
      case 'ChoosingMove':
        this.selectPiece(squareCoordinates);
        break;
      case 'MovingPiece':
        if (coordinatesEqual(squareCoordinates, this.state.selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else { 
          this.movePiece(squareCoordinates);
        }
        break;
      default:
        console.log('Error');
    }
  }

  selectPiece(squareCoordinates: BoardCoordinates) {
    const selectedSquare = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates))
    if (selectedSquare && selectedSquare.piece && selectedSquare.piece.player.colour === this.state.currentPlayer.colour) {
      var newState = {
        ...this.state,
        selectedSquare: selectedSquare === undefined ? null : selectedSquare,
      };
      this.updateGamePhase(newState);
    }
  }

  unselectPiece() {
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: 'ChoosingMove',
      legalSquares: this.getSquaresWithCurrentPlayersPieces(),
    });
  }

  movePiece(squareCoordinates: BoardCoordinates) {

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
