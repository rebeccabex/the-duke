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
  coordinatesAreInSelection,
  boardCoordinatesToString,
  getSquaresWithPlayersPieces,
  getCoordinatesFromMovableCommandSquares,
  getCoordinatesFromBoardSquares,
  getAllPiecesOnBoard,
  getTargettedCoordinatesFromMovableSquares,
  getMoveTypeAttackingCoordinates,
  calculateStraightLineDistanceBetweenCoordinates,
  getAllCoordinatesBetweenPairOfCoordinates,
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
  canDrawFromBag: boolean,
  coordinatesToBlockGuard: Array<BoardCoordinates>,
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
      canDrawFromBag: true,
      coordinatesToBlockGuard: [],
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
      const ableToDraw = this.state.gamePhase === 'ChoosingMove' && this.state.currentPlayer.colour === player.colour && this.state.canDrawFromBag;
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
          gameInstruction = 'GUARD! '
        }
        switch(this.state.gamePhase) {
          case 'ChoosingMove':
            gameInstruction += `${currentPlayer.colour}, make a move`;
            if (this.state.canDrawFromBag) {
              gameInstruction += ' or draw from your bag';
            }
            break;
          case 'MovingPiece':
            gameInstruction += `${currentPlayer.colour}, make a move`;
            break;
          case 'PlacingPiece': 
            gameInstruction += `${currentPlayer.colour}, choose where to place your ${this.state.pieceToPlace!.name}`;
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

    let orthogonalCoordinates = getOrthogonallyAdjacentSquares(dukePosition.coordinates);

    return orthogonalCoordinates.filter(
      coordinates => this.isEmptySquare(coordinates) &&
      (!this.state.currentPlayerIsOnGuard || coordinatesAreInSelection(this.state.coordinatesToBlockGuard, coordinates))
    );
  }

  getCoordinatesWithPlayersPieces(player: Player, gameBoard: GameBoard = this.state.gameBoard) {
    return gameBoard
      .filter(square => square.piece && square.piece.colour === player.colour && square.piece.canMove())
      .map(square => square.coordinates);
  }

  getCoordinatesWithCurrentPlayersPieces(gameBoard: GameBoard = this.state.gameBoard) {
    return this.getCoordinatesWithPlayersPieces(this.state.currentPlayer, gameBoard);
  }

  getCoordinatesWithNextPlayersPieces(gameBoard: GameBoard = this.state.gameBoard) {
    return this.getCoordinatesWithPlayersPieces(getWaitingPlayer(this.state.players, this.state.currentPlayer), gameBoard);
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
    const { currentPlayer, movableSquares, legalSquares, pieceToPlace, selectedSquare } = this.state;

    switch(this.state.gamePhase) {
      case 'PlacingDuke':
        if (coordinatesAreInSelection(legalSquares, squareCoordinates)) {
          this.placePiece(new Duke(currentPlayer.colour), currentPlayer, squareCoordinates);
        }
        break;
      case 'PlacingFootsoldier1':
      case 'PlacingFootsoldier2':
        if (coordinatesAreInSelection(legalSquares, squareCoordinates)) {
          this.placePiece(new Footsoldier(currentPlayer.colour), currentPlayer, squareCoordinates);
        }
        break;
      case 'ChoosingMove':
        this.selectPiece(squareCoordinates);
        break;
      case 'MovingPiece':
        if (coordinatesEqual(squareCoordinates, selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else if (coordinatesAreInSelection(getCoordinatesFromMovableSquares(movableSquares), squareCoordinates)) { 
          this.takeMove(squareCoordinates);
        }
        break;
      case 'CarryingOutCommand':
        if (coordinatesEqual(squareCoordinates, selectedSquare!.coordinates)) {
          this.unselectPiece();
        } else if (coordinatesAreInSelection(getCoordinatesFromMovableCommandSquares(movableSquares), squareCoordinates)) { 
          this.takeMove(squareCoordinates);
        }
        break;
      case 'PlacingPiece':
        if (pieceToPlace && coordinatesAreInSelection(legalSquares, squareCoordinates)) {
          this.placePiece(pieceToPlace, currentPlayer, squareCoordinates);
        }
        break;
      default:
        console.log('Error');
    }
  }

  selectPiece(squareCoordinates: BoardCoordinates) {
    const clickedSquare = this.state.gameBoard.find(square => coordinatesEqual(square.coordinates, squareCoordinates))
    if (clickedSquare && clickedSquare.piece && clickedSquare.piece.colour === this.state.currentPlayer.colour) {
      const movableSquares = clickedSquare.piece.potentialMoves;
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
      legalSquares: this.getCoordinatesWithCurrentPlayersPieces(),
    });
  }

  placePiece(gamePiece: GamePiece, player: Player, squareCoordinates: BoardCoordinates) {
    const nextGamePhase = this.state.gamePhase === 'PlacingPiece' 
      ? 'ChoosingMove'
      : this.getNextGamePhase(player);
    const nextGameStage = this.getNextGameStage(player);
    const nextPlayer = getWaitingPlayer(this.state.players, this.state.currentPlayer);

    gamePiece.updatePosition(squareCoordinates);

    let updatedBoard = this.state.gameBoard.map((square) =>
      coordinatesEqual(square.coordinates, squareCoordinates) ? {...square, piece: gamePiece} : square);

    if (nextGamePhase === 'ChoosingMove') {
      const allPieces = getAllPiecesOnBoard(updatedBoard);
      updatedBoard = this.updatePieceMoves(updatedBoard, allPieces);
    }

    const legalSquares = nextGamePhase === 'ChoosingMove'
    ? this.getCoordinatesWithNextPlayersPieces(updatedBoard)
    : this.getLegalSquaresForNextStep(nextGamePhase, nextPlayer);
    
    const canDrawFromBag = this.getLegalPlacingSquares(nextPlayer).length > 0 && nextPlayer.bagPieces.length > 0;

    this.setState({
      ...this.state,
      gameBoard: updatedBoard,
      currentPlayer: nextPlayer,
      gamePhase: nextGamePhase,
      gameStage: nextGameStage,
      legalSquares,
      canDrawFromBag,
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
      case 'PlacingFootsoldier2':
        return this.getLegalPlacingSquares(nextPlayer);
      case 'ChoosingMove':
        return this.getCoordinatesWithNextPlayersPieces();
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
    const allPieces = getAllPiecesOnBoard(updatedBoard);
    let updatedBoardWithPieceMoves = this.updatePieceMoves(updatedBoard, allPieces);
    const playerIsOnGuard = this.isPlayerOnGuard(updatedBoardWithPieceMoves, allPieces);
    let squaresToAttack = new Array<BoardCoordinates>();
    let canDrawFromBag = this.getLegalPlacingSquares(nextPlayer).length > 0 && nextPlayer.bagPieces.length > 0;
    if (playerIsOnGuard) {
      squaresToAttack = this.getMovableCoordinatesToEscapeGuard(allPieces);
      updatedBoardWithPieceMoves = this.updateMovesToEscapeGuard(updatedBoardWithPieceMoves, allPieces, squaresToAttack);
      canDrawFromBag = this.canPlayerOnGuardDrawFromBag(allPieces, squaresToAttack);
      if (!this.canPlayerMove(allPieces)) {
        newGamePhase = null;
      }
    }
    const playerPieceSquares = this.getCoordinatesWithNextPlayersPieces(updatedBoardWithPieceMoves);
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
      coordinatesToBlockGuard: squaresToAttack,
      canDrawFromBag,
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
  updatePieceMoves(gameBoard: GameBoard, allPieces: GamePiece[]) {
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

  isPlayerOnGuard(gameBoard: GameBoard, allPieces: GamePiece[]) {
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

    return coordinatesAreInSelection(coordinatesAttackedByOpponent, playerToMovesLeader.position!);    
  }

  getMovableCoordinatesToEscapeGuard(allPieces: GamePiece[]) {
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const opponentsPieces = allPieces.filter(piece => piece.colour === this.state.currentPlayer.colour);
    
    const playerToMovesLeader = allPieces.find(piece => piece.colour === playerToMove.colour && piece.isLeader);
    if (!playerToMovesLeader) {
      console.log(`Player ${playerToMove.colour} has no leader`);
      return [];
    }
    if (!playerToMovesLeader.position) {
      console.log(`Player ${playerToMove.colour} does not have a valid position`);
      return [];
    }

    const piecesAttackingLeader = opponentsPieces.filter(
      piece => coordinatesAreInSelection(
        getTargettedCoordinatesFromMovableSquares(piece.potentialMoves), playerToMovesLeader.position!
      )
    );
    
    // NOTE: If the Duke is attacked by multiple pieces, the only way to escape Guard is by moving the Duke unless the attacking pieces are in a straight line.
    // The only way this can happen is if there are two of the opponent's pieces next to each other,
    // the first with Jump Slide, then one with Slide, then 1 or more free spaces (so that the player can block), then the player's Duke.
    if (piecesAttackingLeader.length > 2) {
      return [];
    } else if (piecesAttackingLeader.length === 2) {
      const moveTypesAttackingLeader = piecesAttackingLeader.map(piece => getMoveTypeAttackingCoordinates(playerToMovesLeader.position!, piece.potentialMoves));
      if (moveTypesAttackingLeader.includes('JumpSlide') && moveTypesAttackingLeader.includes('Slide')) {
        const positionOfJumpSlider = piecesAttackingLeader[moveTypesAttackingLeader.indexOf('JumpSlide')].position!;
        const positionOfSlider = piecesAttackingLeader[moveTypesAttackingLeader.indexOf('Slide')].position!;
        const coordinatesBetweenJumpSliderAndLeader = getAllCoordinatesBetweenPairOfCoordinates(positionOfJumpSlider, playerToMovesLeader.position);
        if (coordinatesAreInSelection(coordinatesBetweenJumpSliderAndLeader, positionOfSlider)
          && calculateStraightLineDistanceBetweenCoordinates(positionOfJumpSlider, positionOfSlider) === 1
          && coordinatesBetweenJumpSliderAndLeader.length >= 2) {
          return coordinatesBetweenJumpSliderAndLeader.filter(coordinates => !coordinatesEqual(coordinates, positionOfSlider));
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    const pieceAttackingLeader = piecesAttackingLeader[0];

    const coordinatesToAttack = new Array<BoardCoordinates>();
    coordinatesToAttack.push(pieceAttackingLeader.position!);

    const moveTypeAttackingLeader = getMoveTypeAttackingCoordinates(playerToMovesLeader.position!, pieceAttackingLeader.potentialMoves);

    switch (moveTypeAttackingLeader) {
      case 'Jump':
      case 'Strike':
        break;
      case 'JumpSlide':
        if (calculateStraightLineDistanceBetweenCoordinates(playerToMovesLeader.position, pieceAttackingLeader.position!) > 2) {
          coordinatesToAttack.push(...getAllCoordinatesBetweenPairOfCoordinates(playerToMovesLeader.position, pieceAttackingLeader.position!));
        }
        break;
      case 'Step':
      case 'Slide':
        if (calculateStraightLineDistanceBetweenCoordinates(playerToMovesLeader.position, pieceAttackingLeader.position!) > 1) {
          coordinatesToAttack.push(...getAllCoordinatesBetweenPairOfCoordinates(playerToMovesLeader.position, pieceAttackingLeader.position!));
        }
        break;
      case 'CommandMove':
        if (pieceAttackingLeader.potentialMoves.commandSelectSquares.length === 1) {
          coordinatesToAttack.push(pieceAttackingLeader.potentialMoves.commandSelectSquares[0].coordinates);
        }
        break;
    }

    return coordinatesToAttack;
  }

  updateMovesToEscapeGuard(gameBoard: GameBoard, allPieces: GamePiece[], coordinatesToAttack: BoardCoordinates[]) {
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const playerToMovesNonLeaderPieces = allPieces.filter(piece => piece.colour === playerToMove.colour && !piece.isLeader);
    playerToMovesNonLeaderPieces.forEach(piece => piece.reducePotentialMovesToValidMoves(coordinatesToAttack));

    return gameBoard;
  }

  canPlayerMove(allPieces: GamePiece[]) {
    const playersPieces = allPieces.filter(piece => piece.colour !== this.state.currentPlayer.colour);
    return playersPieces.some(piece => piece.canMove());
  }

  canPlayerOnGuardDrawFromBag(allPieces: GamePiece[], coordinatesToAttack: BoardCoordinates[]) {
    const playerToMove = getWaitingPlayer(this.state.players, this.state.currentPlayer);
    const playerToMovesLeader = allPieces.find(piece => piece.colour === playerToMove.colour && piece.isLeader);
    if (!playerToMovesLeader) {
      console.log(`Player ${playerToMove.colour} has no leader`);
      return false;
    }
    if (!playerToMovesLeader.position) {
      console.log(`Player ${playerToMove.colour} does not have a valid position`);
      return false;
    }

    return coordinatesToAttack.filter(
      coordinates => coordinatesAreInSelection(getOrthogonallyAdjacentSquares(playerToMovesLeader.position!), coordinates)
    ).length > 0;
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
