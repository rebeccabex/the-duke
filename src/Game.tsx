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
  getAvailableMoveSquares,
  MovableSquares,
  emptyMovableSquares,
  getCoordinatesFromMovableSquares,
  isTheSameSquare,
  coordinatesInSelection
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
  movableSquares: MovableSquares,
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
      movableSquares: emptyMovableSquares(),
    }

    this.createBags = this.createBags.bind(this);
    this.startGame = this.startGame.bind(this);
    this.selectSquare = this.selectSquare.bind(this);
    this.getWaitingPlayer = this.getWaitingPlayer.bind(this);
    this.placeStartingPiece = this.placeStartingPiece.bind(this);
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

  getLegalPlacingSquares(player: Player) {
    const dukePosition = this.state.gameBoard.find(
      square => square.piece && square.piece.piece.name === 'Duke' && square.piece.player === player);

    if (!!!dukePosition) {
      return [];
    }

    const orthogSquares = getOrthogonallyAdjacentSquares(dukePosition.coordinates);
    return orthogSquares.filter(square => this.isEmptySquare(square));
  }

  // TODO: Filter out pieces that can't currently move
  getSquaresWithPlayersPieces(player: Player) {
    return this.state.gameBoard
      .filter(square => square.piece && square.piece.player.colour === player.colour)
      .map(square => square.coordinates);
  }

  getSquaresWithCurrentPlayersPieces() {
    return this.getSquaresWithPlayersPieces(this.state.currentPlayer);
  }

  getSquaresWithNextPlayersPieces() {
    return this.getSquaresWithPlayersPieces(this.getWaitingPlayer());
  }

  getLegalPieceMovingSquares(clickedSquare: BoardSquare) {
    const { gameBoard, currentPlayer } = this.state;
    if (!!clickedSquare) {
      const selectedPiece = clickedSquare.piece;
      if (!!selectedPiece) {
        const currentMoveSet = selectedPiece.piece.isFlipped ? selectedPiece.piece.flippedMoveSet: selectedPiece.piece.initialMoveSet;
        return getAvailableMoveSquares(currentMoveSet, clickedSquare, gameBoard, currentPlayer);
      }
    }
    console.log('No piece selected');
    return emptyMovableSquares();
  }

  getNextGamePhase(player: Player) {
    if (player.colour === this.state.startPlayer.colour) {
      return this.state.gamePhase;
    }
    switch(this.state.gamePhase) {
      case 'PlacingDuke':
        return 'PlacingFootsoldier1';
      case 'PlacingFootsoldier1': 
        return 'PlacingFootsoldier2';
      case 'PlacingFootsoldier2': 
        return 'ChoosingMove';
      default:
        return this.state.gamePhase;
    }
  }

  getNextGameStage(player: Player) {
    if (player.colour === this.state.startPlayer.colour) {
      return this.state.gameStage;
    }
    switch (this.state.gamePhase) {
      case 'PlacingFootsoldier2':
        return 'Playing';
      default:
        return this.state.gameStage;
    }
  }

  selectSquare(squareCoordinates: BoardCoordinates) {
    switch(this.state.gamePhase) {
      case 'PlacingDuke':
        this.placeStartingPiece(new Duke(), this.state.currentPlayer, squareCoordinates);
        break;
      case 'PlacingFootsoldier1':
      case 'PlacingFootsoldier2':
        this.placeStartingPiece(new Footsoldier(), this.state.currentPlayer, squareCoordinates);
        break;
      case 'ChoosingMove':
        this.selectPiece(squareCoordinates);
        break;
      case 'MovingPiece':
        if (coordinatesEqual(squareCoordinates, this.state.selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else if (coordinatesInSelection(getCoordinatesFromMovableSquares(this.state.movableSquares), squareCoordinates)) { 
          this.movePiece(squareCoordinates);
        }
        break;
      default:
        console.log('Error');
    }
  }

  selectPiece(squareCoordinates: BoardCoordinates) {
    const clickedSquare = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates))
    if (clickedSquare && clickedSquare.piece && clickedSquare.piece.player.colour === this.state.currentPlayer.colour) {
      const movableSquares = this.getLegalPieceMovingSquares(clickedSquare);
      this.setState({
        ...this.state,
        selectedSquare: clickedSquare === undefined ? null : clickedSquare,
        gamePhase: 'MovingPiece',
        movableSquares: movableSquares,
        legalSquares: getCoordinatesFromMovableSquares(movableSquares),
      });
    }
  }

  unselectPiece() {
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: 'ChoosingMove',
      movableSquares: emptyMovableSquares(),
      legalSquares: this.getSquaresWithCurrentPlayersPieces(),
    });
  }

  placeStartingPiece(gamePiece: GamePiece, player: Player, squareCoordinates: BoardCoordinates) {
    var pieceToPlace: PlayerPiece = { player, piece: gamePiece };

    const nextGamePhase = this.getNextGamePhase(player);
    const nextGameStage = this.getNextGameStage(player);

    const legalPlacingSquares = this.getLegalSquaresForNextStep(nextGamePhase, this.getWaitingPlayer());

    this.setState({
      ...this.state,
      gameBoard: this.state.gameBoard.map((square) =>
        coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: pieceToPlace} : square),
      currentPlayer: this.getWaitingPlayer(),
      gamePhase: nextGamePhase,
      gameStage: nextGameStage,
      legalSquares: legalPlacingSquares,
    });
  }

  getLegalSquaresForNextStep(nextGamePhase: GamePhase, nextPlayer: Player) {
    switch (nextGamePhase) {
      case 'PlacingDuke':
        if (nextPlayer.colour === this.state.startPlayer.colour) {
          return FirstStartingPositions;
        } else {
          return SecondStartingPositions;
        }
      case 'PlacingFootsoldier1':
        return this.getLegalPlacingSquares(nextPlayer);
      case 'PlacingFootsoldier2':
        return this.getLegalPlacingSquares(nextPlayer);
      case 'ChoosingMove':
        return this.getSquaresWithNextPlayersPieces();
      default:
        console.log('Invalid game phase');
        return [];
    }
  }

  movePiece(squareCoordinates: BoardCoordinates) {
    const { selectedSquare, movableSquares } = this.state;
    const activePiece = selectedSquare ? selectedSquare.piece : null;
    if (activePiece) {
      if (movableSquares.commandSquares.some(
          square => coordinatesEqual(square.coordinates, squareCoordinates))
        ) {
          if (movableSquares.commandStartSquare) {
            this.carryOutCommand(squareCoordinates, activePiece);
          } else {
            this.selectPieceToCommand(squareCoordinates, activePiece);
          }
      } else if (movableSquares.strikeSquares.some(
        square => coordinatesEqual(square.coordinates, squareCoordinates))
      ) {
        this.carryOutStrike(squareCoordinates, activePiece);
      } else {
        this.carryOutMovement(squareCoordinates, activePiece);
      }
    }
  }

  selectPieceToCommand(squareCoordinates: BoardCoordinates, activePiece: PlayerPiece) {
    const { gameBoard, selectedSquare, currentPlayer } = this.state;
    const moveSet = activePiece.piece.isFlipped ? activePiece.piece.flippedMoveSet : activePiece.piece.initialMoveSet;
    const movableSquaresForCommand = emptyMovableSquares();
    const commandStartSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates));
    if (selectedSquare) {
      movableSquaresForCommand.commandSquares = moveSet.getLegalMoveToSquaresForCommands(selectedSquare, gameBoard, currentPlayer);
    }
    if (commandStartSquare) {
      movableSquaresForCommand.commandStartSquare = commandStartSquare;
    }
    this.setState({
      ...this.state,
      gamePhase: 'MovingPiece',
      legalSquares: getCoordinatesFromMovableSquares(movableSquaresForCommand),
      movableSquares: movableSquaresForCommand,
    });
  }

  carryOutCommand(squareCoordinates: BoardCoordinates, activePiece: PlayerPiece) {
    const { gameBoard, movableSquares } = this.state;
    const movingPiece = movableSquares.commandStartSquare!.piece;
    activePiece.piece.flipPiece();
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: 'ChoosingMove',
      currentPlayer: this.getWaitingPlayer(),
      legalSquares: this.getSquaresWithNextPlayersPieces(),
      movableSquares: emptyMovableSquares(),
      gameBoard: gameBoard.map(
        square => coordinatesEqual(square.coordinates, squareCoordinates)
          ? { ...square, piece: movingPiece }
          : isTheSameSquare(square, movableSquares.commandStartSquare)
            ? { ...square, piece: null }
            : square
      ),
    });
  }

  carryOutStrike(squareCoordinates: BoardCoordinates, activePiece: PlayerPiece) {
    activePiece.piece.flipPiece();
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: 'ChoosingMove',
      currentPlayer: this.getWaitingPlayer(),
      legalSquares: this.getSquaresWithNextPlayersPieces(),
      movableSquares: emptyMovableSquares(),
      gameBoard: this.state.gameBoard.map(
        square => coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: null} : square
      ),
    });
  }

  carryOutMovement(squareCoordinates: BoardCoordinates, activePiece: PlayerPiece) {
    activePiece.piece.flipPiece();
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: 'ChoosingMove',
      currentPlayer: this.getWaitingPlayer(),
      legalSquares: this.getSquaresWithNextPlayersPieces(),
      movableSquares: emptyMovableSquares(),
      gameBoard: this.state.gameBoard.map(
        square => coordinatesEqual(square.coordinates, squareCoordinates)
          ? { ...square, piece: activePiece}
          : isTheSameSquare(square, this.state.selectedSquare)
            ? { ...square, piece: null }
            : square
      ),
    });
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
