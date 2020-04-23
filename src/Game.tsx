import React from 'react';
import './App.css';
import { Bag } from './Bag';
import { Board } from './Board';
import { GameStage, GamePhase, getMovementType, MovementType } from 'GamePhases'
import {
  BoardCoordinates,
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
  coordinatesInSelection,
  boardCoordinatesToString,
  getSquaresWithPlayersPieces,
  getCoordinatesFromMovableCommandSquares,
  getCoordinatesFromBoardSquares,
  getAllPiecesOnBoard,
  getTargettedCoordinatesFromMovableSquares,
} from 'GameBoard';
import {
  Player,
  PlayerColours,
  FirstStartingPositions,
  SecondStartingPositions,
  getWaitingPlayer
} from 'Player';
import { GamePiece } from 'GamePiece';
import { Duke, Footsoldier, BagPieceList, createNewPiece } from 'PieceData';

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
  pieceToPlace: GamePiece | null,
  currentPlayerIsOnGuard: boolean,
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
      pieceToPlace: null,
      currentPlayerIsOnGuard: false,
    }

    this.createBags = this.createBags.bind(this);
    this.startGame = this.startGame.bind(this);
    this.selectSquare = this.selectSquare.bind(this);
    this.placePiece = this.placePiece.bind(this);
    this.drawFromBag = this.drawFromBag.bind(this);
  }

  startGame() {
    const playersWithBagPieces = this.state.players.map(player => {
      return { ...player, bagPieces: this.addPiecesToBag(player) }
    });
    this.setState({
      ...this.state,
      gameStage: 'Setup',
      gamePhase: 'PlacingDuke',
      legalSquares: FirstStartingPositions,
      currentPlayer: this.state.startPlayer,
      players: playersWithBagPieces,
    });
  };

  addPiecesToBag(player: Player) {
    const BagPieces = Array<GamePiece>();
    BagPieceList.forEach(pieceName => {
      const newPiece = createNewPiece(pieceName, player.colour);
      if (newPiece !== null) {
        BagPieces.push(newPiece);
      }
    });
    return BagPieces;
  }

  createBags() {
    var bags = new Array<JSX.Element>();
    this.state.players.forEach(player => {
      const ableToDraw = this.state.gamePhase === 'ChoosingMove' && this.state.currentPlayer.colour === player.colour;
      bags.push(<Bag
        colour={player.colour}
        pieces={player.bagPieces}
        ableToDraw={ableToDraw}
        drawFromBag={this.drawFromBag}
      />);
    });
    return <div>{bags}</div>;
  }

  setGameControls() {
    const { players, currentPlayer } = this.state;
    var gameInstruction = '';
    switch(this.state.gameStage) {
      case 'Start':
        return <button className="start-button" onClick={this.startGame}>{'Start game'}</button>;
      case 'Setup':
        switch(this.state.gamePhase) {
          case 'PlacingDuke':
            gameInstruction = `${currentPlayer.colour}, choose where to place your Duke`;
            break;
          case 'PlacingFootsoldier1':
          case 'PlacingFootsoldier2':
            gameInstruction = `${currentPlayer.colour}, choose where to place your Footsoldier`;
        }
        break;
      case 'Playing':
        if (this.state.currentPlayerIsOnGuard) {
          gameInstruction = 'GUARD!'
        }
        switch(this.state.gamePhase) {
          case 'ChoosingMove':
            gameInstruction += ` ${currentPlayer.colour}, make a move or draw from your bag`;
            break;
          case 'MovingPiece':
            gameInstruction += ` ${currentPlayer.colour}, make a move`;
            break;
          case 'PlacingPiece': 
            gameInstruction += ` ${currentPlayer.colour}, choose where to place your piece`;
            break;
        }
        break;
      case 'Finished':
        gameInstruction = `Congratulations, ${getWaitingPlayer(players, currentPlayer).colour}`;
    }
    return <div className='game-instruction'>{gameInstruction}</div>;
  }

  getPieceOnSquare(coordinates: BoardCoordinates): GamePiece | null {
    var squareOrUndefined = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, coordinates));
    return (squareOrUndefined === undefined || squareOrUndefined === null ? null : squareOrUndefined.piece);
  }

  isEmptySquare(coordinates: BoardCoordinates): Boolean {
    return this.getPieceOnSquare(coordinates) === null;
  }

  getLegalPlacingSquares(player: Player) {
    const dukePosition = this.state.gameBoard.find(
      square => square.piece && square.piece.name === 'Duke' && square.piece.colour === player.colour);

    if (!!!dukePosition) {
      return [];
    }

    const orthogSquares = getOrthogonallyAdjacentSquares(dukePosition.coordinates);
    return orthogSquares.filter(square => this.isEmptySquare(square));
  }

  // TODO: Filter out pieces that can't currently move
  getSquaresWithPlayersPieces(player: Player) {
    return this.state.gameBoard
      .filter(square => square.piece && square.piece.colour === player.colour)
      .map(square => square.coordinates);
  }

  getSquaresWithCurrentPlayersPieces() {
    return this.getSquaresWithPlayersPieces(this.state.currentPlayer);
  }

  getSquaresWithNextPlayersPieces() {
    return this.getSquaresWithPlayersPieces(getWaitingPlayer(this.state.players, this.state.currentPlayer));
  }

  getLegalPieceMovingSquares(clickedSquare: BoardSquare) {
    const { gameBoard, currentPlayer } = this.state;
    if (!!clickedSquare) {
      const selectedPiece = clickedSquare.piece;
      if (!!selectedPiece) {
        const currentMoveSet = selectedPiece.isFlipped ? selectedPiece.flippedMoveSet: selectedPiece.initialMoveSet;
        return getAvailableMoveSquares(currentMoveSet, clickedSquare.coordinates, gameBoard, currentPlayer);
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
        this.placePiece(new Duke(this.state.currentPlayer.colour), this.state.currentPlayer, squareCoordinates);
        break;
      case 'PlacingFootsoldier1':
      case 'PlacingFootsoldier2':
        this.placePiece(new Footsoldier(this.state.currentPlayer.colour), this.state.currentPlayer, squareCoordinates);
        break;
      case 'ChoosingMove':
        this.selectPiece(squareCoordinates);
        break;
      case 'MovingPiece':
        if (coordinatesEqual(squareCoordinates, this.state.selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else if (coordinatesInSelection(getCoordinatesFromMovableSquares(this.state.movableSquares), squareCoordinates)) { 
          this.takeMove(squareCoordinates);
        }
        break;
      case 'CarryingOutCommand':
        if (coordinatesEqual(squareCoordinates, this.state.selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else if (coordinatesInSelection(getCoordinatesFromMovableCommandSquares(this.state.movableSquares), squareCoordinates)) { 
          this.takeMove(squareCoordinates);
        }
        break;
      case 'PlacingPiece':
        if (this.state.pieceToPlace) {
          this.placePiece(this.state.pieceToPlace, this.state.currentPlayer, squareCoordinates);
        }
        break;
      default:
        console.log('Error');
    }
  }

  selectPiece(squareCoordinates: BoardCoordinates) {
    const clickedSquare = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates))
    if (clickedSquare && clickedSquare.piece && clickedSquare.piece.colour === this.state.currentPlayer.colour) {
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

  placePiece(gamePiece: GamePiece, player: Player, squareCoordinates: BoardCoordinates) {
    const nextGamePhase = this.state.gamePhase === 'PlacingPiece' 
      ? 'ChoosingMove'
      : this.getNextGamePhase(player);
    const nextGameStage = this.getNextGameStage(player);

    const legalPlacingSquares = this.getLegalSquaresForNextStep(nextGamePhase, getWaitingPlayer(this.state.players, this.state.currentPlayer));
    gamePiece.updatePosition(squareCoordinates);

    this.setState({
      ...this.state,
      gameBoard: this.state.gameBoard.map((square) =>
        coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: gamePiece} : square),
      currentPlayer: getWaitingPlayer(this.state.players, this.state.currentPlayer),
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

  takeMove(squareCoordinates: BoardCoordinates) {
    const { selectedSquare, movableSquares } = this.state;
    const activePiece = selectedSquare ? selectedSquare.piece : null;
    const movementType = getMovementType(movableSquares, squareCoordinates);
    if (activePiece && movementType) {
      if (movementType === 'CommandSelect') {
        this.selectPieceToCommand(squareCoordinates);
      } else {
        this.movePiece(squareCoordinates, movementType, activePiece);
      }
    } else {
      console.log(`Error: no active piece on selected square ${boardCoordinatesToString(squareCoordinates)}`);
    }
  }

  movePiece(squareCoordinates: BoardCoordinates, movementType: MovementType, activePiece: GamePiece) {
    const { gameBoard } = this.state;
    const nextPlayer = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    let updatedBoard = this.state.gameBoard;
    activePiece.flipPiece();
    const playerPieceSquares = getCoordinatesFromBoardSquares(getSquaresWithPlayersPieces(gameBoard, nextPlayer));
    switch (movementType) {
      case 'StandardMove':
        updatedBoard = this.carryOutMovement(squareCoordinates, activePiece);
        break;
      case 'Strike':
        updatedBoard = this.carryOutStrike(squareCoordinates);
        break;
      case 'CommandMove':
        updatedBoard = this.carryOutCommand(squareCoordinates);
        break;
      default:
        console.log(`Invalid move type`);
    }
    let newGamePhase = 'ChoosingMove' as GamePhase;
    const updatedBoardWithPieceMoves = this.updatePieceMoves(updatedBoard);
    const playerIsOnGuard = this.isPlayerOnGuard(updatedBoardWithPieceMoves);
    if (playerIsOnGuard) {
      const opponentHasWon = !this.canPlayerEscapeGuard(updatedBoardWithPieceMoves);
      if (opponentHasWon) {
        newGamePhase = null;
      }
    }
    this.setState({
      ...this.state,
      selectedSquare: null,
      gamePhase: newGamePhase,
      gameStage: newGamePhase ? this.state.gameStage : 'Finished',
      currentPlayer: getWaitingPlayer(this.state.players, this.state.currentPlayer),
      legalSquares: playerPieceSquares,
      movableSquares: emptyMovableSquares(),
      gameBoard: updatedBoardWithPieceMoves,
      currentPlayerIsOnGuard: playerIsOnGuard,
    });
  }

  // TODO handle if piece being commanded is Duke
  selectPieceToCommand(squareCoordinates: BoardCoordinates) {
    const { gameBoard } = this.state;
    const movableSquares = this.state.movableSquares;
    const commandStartSquare = gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates));
    if (commandStartSquare) {
      movableSquares.commandStartSquare = commandStartSquare;
    }
    this.setState({
      ...this.state,
      gamePhase: 'CarryingOutCommand',
      legalSquares: getCoordinatesFromMovableCommandSquares(movableSquares),
      movableSquares,
    });
  }

  // TODO add pieceTaken to targetted piece if required
  carryOutCommand(squareCoordinates: BoardCoordinates) {
    const movingPiece = this.state.movableSquares.commandStartSquare!.piece;
    if (movingPiece) {
      movingPiece.updatePosition(squareCoordinates);
      return this.state.gameBoard.map(
        square => coordinatesEqual(square.coordinates, squareCoordinates)
          ? { ...square, piece: movingPiece }
          : isTheSameSquare(square, this.state.movableSquares.commandStartSquare)
            ? { ...square, piece: null }
            : square
      );
    } else {
      console.log('No piece selected to move by command');
      return this.state.gameBoard;
    }
  }

  // TODO add pieceTaken to targetted piece if required
  carryOutStrike(squareCoordinates: BoardCoordinates) {
    return this.state.gameBoard.map(
      square => coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: null} : square
    );
  }

  // TODO add pieceTaken to targetted piece if required
  carryOutMovement(squareCoordinates: BoardCoordinates, activePiece: GamePiece) {
    activePiece.updatePosition(squareCoordinates);
    return this.state.gameBoard.map(
      square => coordinatesEqual(square.coordinates, squareCoordinates)
        ? { ...square, piece: activePiece}
        : isTheSameSquare(square, this.state.selectedSquare)
          ? { ...square, piece: null }
          : square
    );
  }

  drawFromBag() {
    const { bagPieces } = this.state.currentPlayer;
    var drawnPiece = bagPieces[Math.floor(Math.random() * bagPieces.length)];
    this.setState({
      ...this.state,
      gamePhase: 'PlacingPiece',
      legalSquares: this.getLegalPlacingSquares(this.state.currentPlayer),
      players: this.state.players.map(
        player => player === this.state.currentPlayer
        ? {
          ...player,
          bagPieces: player.bagPieces.filter(piece => piece !== drawnPiece)
        }
        : player
      ),
      pieceToPlace: drawnPiece,
    })
  }

  // TODO refactor
  updatePieceMoves(gameBoard: GameBoard) {
    const allPieces = getAllPiecesOnBoard(gameBoard);
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const opponent = this.state.currentPlayer;

    const opponentsNonLeaderPieces = allPieces.filter(piece => piece.colour === opponent.colour && !piece.isLeader);
    opponentsNonLeaderPieces.forEach(piece => piece.updatePotentialMoves(gameBoard, opponent, true));

    // TODO handle pinned pieces
    const playerToMovesNonLeaderPieces = allPieces.filter(piece => piece.colour === playerToMove.colour && !piece.isLeader);
    playerToMovesNonLeaderPieces.forEach(piece => piece.updatePotentialMoves(gameBoard, playerToMove));

    const opponentsLeader = allPieces.find(piece => piece.colour === opponent.colour && piece.isLeader);
    if (!opponentsLeader) {
      console.log(`Player ${opponent.colour} has no leader`);
      return gameBoard;
    }
    opponentsLeader.updatePotentialMoves(gameBoard, opponent, true);

    const coordinatesAttackedByOpponent = [
      ...opponentsNonLeaderPieces.flatMap(piece => getTargettedCoordinatesFromMovableSquares(piece.potentialMoves)),
      ...getTargettedCoordinatesFromMovableSquares(opponentsLeader.potentialMoves),
    ].filter((square, index, array) => index === array.indexOf(square));

    const playerToMovesLeader = allPieces.find(piece => piece.colour === playerToMove.colour && piece.isLeader);
    if (!playerToMovesLeader) {
      console.log(`Player ${playerToMove.colour} has no leader`);
      return gameBoard;
    }
    playerToMovesLeader.updatePotentialMoves(gameBoard, playerToMove, false, coordinatesAttackedByOpponent);

    return gameBoard;
  }

  isPlayerOnGuard(gameBoard: GameBoard) {
    const allPieces = getAllPiecesOnBoard(gameBoard);
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const opponentsPieces = allPieces.filter(piece => piece.colour === this.state.currentPlayer.colour);

    const playerToMovesLeader = allPieces.find(piece => piece.colour === playerToMove.colour && piece.isLeader);
    if (!playerToMovesLeader) {
      console.log(`Player ${playerToMove.colour} has no leader`);
      return false;
    }
    const coordinatesAttackedByOpponent = [
      ...opponentsPieces.flatMap(piece => getTargettedCoordinatesFromMovableSquares(piece.potentialMoves)),
    ].filter((square, index, array) => index === array.indexOf(square));

    return coordinatesInSelection(coordinatesAttackedByOpponent, playerToMovesLeader.position!);    
  }

  canPlayerEscapeGuard(gameBoard: GameBoard) {
    const allPieces = getAllPiecesOnBoard(gameBoard);
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const opponentsPieces = allPieces.filter(piece => piece.colour === this.state.currentPlayer.colour);
    const playerToMovesNonLeaderPieces = allPieces.filter(piece => piece.colour === playerToMove.colour && !piece.isLeader);
    
    const playerToMovesLeader = allPieces.find(piece => piece.colour === playerToMove.colour && piece.isLeader);
    if (!playerToMovesLeader) {
      console.log(`Player ${playerToMove.colour} has no leader`);
      return false;
    }

    // can move Duke to safe square
    if (getCoordinatesFromMovableSquares(playerToMovesLeader.potentialMoves).length > 0) {
      return true;
    }

    // can take attacking piece (only if 1 piece attacking)
    // TODO handle Command - taking Command piece may already be covered, but need to handle taking piece if it's only one that can be commanded
    const piecesAttackingLeader = opponentsPieces.filter(
      piece => coordinatesInSelection(
        getTargettedCoordinatesFromMovableSquares(piece.potentialMoves), playerToMovesLeader.position!
      )
    );

    if (piecesAttackingLeader.length === 1 && playerToMovesNonLeaderPieces.some(
      piece => coordinatesInSelection(
        getTargettedCoordinatesFromMovableSquares(piece.potentialMoves), piecesAttackingLeader[0].position!
      )
    )) {
      return true;
    }

    // TODO can put piece in way of attack

    return false;
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
