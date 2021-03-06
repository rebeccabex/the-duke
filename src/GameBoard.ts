import { GamePiece } from "GamePiece";
import { Player } from "Player";
import { StandardMovableSquares, MovableSquares } from "MoveHelper";

export type GameBoard = Array<BoardSquare>;

export const createGameBoard = (): Array<BoardSquare>  => {
  var newGameBoard = new Array<BoardSquare>();
  for (let i = 0; i < 6 ; i++) {
      for (let j = 0; j < 6; j++) {
          var boardSquare: BoardSquare = { coordinates: {x: i, y: j}, piece: null};
          newGameBoard.push(boardSquare);
      }
  }
  return newGameBoard;
}

export type BoardSquare = {
  coordinates: BoardCoordinates;
  piece: GamePiece | null;
}

export type BoardCoordinates = {x: number, y: number};

export type RelativeCoordinates = BoardCoordinates;

export const boardCoordinatesToString = (boardCoordinates: BoardCoordinates): string => {
  return `(${boardCoordinates.x}, ${boardCoordinates.y})`;
}

export const boardSquareIsEmpty = (boardSquare?: BoardSquare): boolean => {
  return !!boardSquare && boardSquare.piece === null;
}

export const boardSquareContainsEnemy = (boardSquare: BoardSquare, currentPlayer: Player): boolean => {
  return boardSquare.piece !== null && boardSquare.piece.colour !== currentPlayer.colour;
}

export const boardSquareContainsFriendlyPiece = (boardSquare: BoardSquare, currentPlayer: Player): boolean => {
  return boardSquare.piece !== null && boardSquare.piece.colour === currentPlayer.colour;
}

export const coordinatesAreEmpty = (board: GameBoard, coordinates: BoardCoordinates): boolean => {
  return board.some(square => coordinatesEqual(square.coordinates, coordinates) && !square.piece);
}

export const getAllPiecesOnBoard = (board: GameBoard): Array<GamePiece> => {
  const pieces = new Array<GamePiece>();
  board.forEach(square => square.piece !== null ? pieces.push(square.piece) : {});
  return pieces;
}

export const getPlayersPiecesOnBoard = (board: GameBoard, player: Player): Array<GamePiece> => {
  return getAllPiecesOnBoard(board).filter(piece => piece.colour === player.colour);
}

export const getOccupiedSquares = (board: GameBoard): Array<BoardSquare> => {
  return board.filter(square => square.piece !== null);
}

export const getSquaresWithPlayersPieces = (board: GameBoard, player: Player): Array<BoardSquare> => {
  return board.filter(square => square.piece !== null && square.piece.colour === player.colour);
}

export const coordinatesEqual = (coordinates1: BoardCoordinates | null, coordinates2: BoardCoordinates | null): boolean => {
  return !!coordinates1 && !!coordinates2 && coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;
}

export const isTheSameSquare = (square1: BoardSquare | null, square2: BoardSquare | null): boolean => {
  return !!square1 && !!square2 && coordinatesEqual(square1.coordinates, square2.coordinates);
}

export const applyMoveToCoordinates = (currentCoordinates: BoardCoordinates, move: BoardCoordinates): BoardCoordinates => {
  return {x: currentCoordinates.x + move.x, y: currentCoordinates.y + move.y};
}

export const multiplyMoveVectorByScalar = (moveVector: BoardCoordinates, scalar: number): BoardCoordinates => {
  return {x: moveVector.x * scalar, y: moveVector.y * scalar}
}

export const applyRangeOfMovesToCoordinates = (currentCoordinates: BoardCoordinates, direction: BoardCoordinates): BoardCoordinates[] => {
  const rangeOfCoordinates = new Array<BoardCoordinates>();
  for (var i = 1; i < 6; i++) {
    const newCoordinates = applyMoveToCoordinates(currentCoordinates, {x: direction.x * i, y: direction.y * i});
    rangeOfCoordinates.push(newCoordinates);
  }
  return rangeOfCoordinates;
}

export const getCoordinatesFromBoardSquares = (squares: BoardSquare[]): BoardCoordinates[] => {
  return squares.map(square => square.coordinates);
}

export const getCoordinatesFromStandardMovableSquares = (standardMovableSquares: StandardMovableSquares): BoardCoordinates[] => {
  return [
    ...standardMovableSquares.stepMovableSquares.map(square => square.coordinates),
    ...standardMovableSquares.jumpMovableSquares.map(square => square.coordinates),
    ...standardMovableSquares.slideMovableSquares.map(square => square.coordinates),
    ...standardMovableSquares.jumpSlideMovableSquares.map(square => square.coordinates),
  ];
}

export const getCoordinatesFromMovableSquares = (movableSquares: MovableSquares): BoardCoordinates[] => {
  return [
    ...getCoordinatesFromStandardMovableSquares(movableSquares.standardMovableSquares),
    ...movableSquares.strikeSquares.map(square => square.coordinates),
    ...movableSquares.commandSelectSquares.map(square => square.coordinates),
  ];
}

export const getCoordinatesFromMovableCommandSquares = (movableSquares: MovableSquares): BoardCoordinates[] => {
  return [...movableSquares.commandTargetSquares.map(square => square.coordinates)];
}

export const getTargettedCoordinatesFromMovableSquares = (movableSquares: MovableSquares): BoardCoordinates[] => {
  return [
    ...getCoordinatesFromStandardMovableSquares(movableSquares.standardMovableSquares),
    ...movableSquares.strikeSquares.map(square => square.coordinates),
    ...movableSquares.commandTargetSquares.map(square => square.coordinates),
  ];
}

export const isStandardMoveBlocked = (currentCoordinates: BoardCoordinates, move: BoardCoordinates, gameBoard: GameBoard): boolean => {
  const loopBound = Math.max(Math.abs(move.x), Math.abs(move.y));
  for (let i = 1; i < loopBound; i++) {
    var stepX = move.x === 0 ? 0 : move.x < 0 ? -i : i;
    var stepY = move.y === 0 ? 0 : move.y < 0 ? -i : i;
    const moveStep = applyMoveToCoordinates(currentCoordinates, { x: stepX, y: stepY });
    if (!boardSquareIsEmpty(gameBoard.find(square => coordinatesEqual(square.coordinates, moveStep)))) {
      return true;
    }
  }
  return false;
}

export const coordinatesAreInSelection = (selection: BoardCoordinates[], coordinates: BoardCoordinates): boolean => {
  return selection.some(c => coordinatesEqual(c, coordinates));
}

export const coordinatesAreInBoardSquareSelection = (selection: BoardSquare[], coordinates: BoardCoordinates): boolean => {
  return selection.some(square => coordinatesEqual(square.coordinates, coordinates));
}

export const getOrthogonallyAdjacentCoordinates = (currentCoordinates: BoardCoordinates): BoardCoordinates[] => {
  var neighbourhood = [];

  for (var i = -1; i < 2; i++){
    for (var j = -1; j < 2; j++){
      const coordinates = {x: currentCoordinates.x + i, y: currentCoordinates.y + j};
      if (Math.abs(i) !== Math.abs(j) && areCoordinatesOnBoard(coordinates)) {
        neighbourhood.push(coordinates);
      }
    }
  }
  return neighbourhood;
}

export const coordinatesAreGuarded = (coordinates: BoardCoordinates, guardedCoordinates: BoardCoordinates[] = []): boolean => {
  if (guardedCoordinates.length === 0) {
    return false;
  } else {
    return coordinatesAreInSelection(guardedCoordinates, coordinates);
  }
}

export const pairOfCoordinatesAreUpwardsDiagonal = (firstCoordinates: BoardCoordinates, secondCoordinates: BoardCoordinates): boolean => {
  return firstCoordinates.x + firstCoordinates.y === secondCoordinates.x + secondCoordinates.y;
}

export const pairOfCoordinatesAreDownwardsDiagonal = (firstCoordinates: BoardCoordinates, secondCoordinates: BoardCoordinates): boolean => {
  return firstCoordinates.x - firstCoordinates.y === secondCoordinates.x - secondCoordinates.y;
}

export const pairOfCoordinatesAreDiagonal = (firstCoordinates: BoardCoordinates, secondCoordinates: BoardCoordinates): boolean => {
  return pairOfCoordinatesAreUpwardsDiagonal(firstCoordinates, secondCoordinates)
    || pairOfCoordinatesAreDownwardsDiagonal(firstCoordinates, secondCoordinates);
}

export const getLeftmostOfCoordinates = (coordinateSelection: BoardCoordinates[]): BoardCoordinates => {
  return coordinateSelection.sort((a, b) => a.x - b.x)[0];
}

export const calculateStraightLineDistanceBetweenCoordinates = (firstCoordinates: BoardCoordinates, secondCoordinates: BoardCoordinates): number => {
  if (firstCoordinates.x === secondCoordinates.x) {
    return Math.abs(firstCoordinates.y - secondCoordinates.y);
  } else if (firstCoordinates.y === secondCoordinates.y) {
    return Math.abs(firstCoordinates.x - secondCoordinates.x);
  } else if (pairOfCoordinatesAreDiagonal(firstCoordinates, secondCoordinates)) {
    return Math.abs(firstCoordinates.x - secondCoordinates.x);
  } else {
    return -1;
  }
}

export const getAllCoordinatesBetweenPairOfCoordinates = (
  firstCoordinates: BoardCoordinates,
  secondCoordinates: BoardCoordinates
): BoardCoordinates[] => {
  const coordinatesToReturn = new Array<BoardCoordinates>();
  const distance = calculateStraightLineDistanceBetweenCoordinates(firstCoordinates, secondCoordinates);
  if (firstCoordinates.x === secondCoordinates.x) {
    const startY = Math.min(firstCoordinates.y, secondCoordinates.y);
    for (let i = 1; i < distance; i++) {
      coordinatesToReturn.push({ x: firstCoordinates.x, y: startY + i });
    }
  } else if (firstCoordinates.y === secondCoordinates.y) {
    const startX = Math.min(firstCoordinates.x, secondCoordinates.x);
    for (let i = 1; i < distance; i++) {
      coordinatesToReturn.push({ x: startX + i, y: firstCoordinates.y });
    }
  } else if (pairOfCoordinatesAreUpwardsDiagonal(firstCoordinates, secondCoordinates)) {
    const startCoordinates = getLeftmostOfCoordinates([firstCoordinates, secondCoordinates]);
    for (let i = 1; i < distance; i++) {
      coordinatesToReturn.push({ x: startCoordinates.x + i, y: startCoordinates.y - i });
    }
  } else if (pairOfCoordinatesAreDownwardsDiagonal(firstCoordinates, secondCoordinates)) {
    const startCoordinates = getLeftmostOfCoordinates([firstCoordinates, secondCoordinates]);
    for (let i = 1; i < distance; i++) {
      coordinatesToReturn.push({ x: startCoordinates.x + i, y: startCoordinates.y + i });
    }
  }
  return coordinatesToReturn
}

export const areCoordinatesOnBoard = (coordinates: BoardCoordinates): boolean => {
  return coordinates.x >= 0 && coordinates.x < 6 && coordinates.y >= 0 && coordinates.y < 6;
}

export const areCoordinatesValidForMove = (coordinates: BoardCoordinates, blockedCoordinates?: BoardCoordinates[]): boolean => {
  return areCoordinatesOnBoard(coordinates) && !(blockedCoordinates && coordinatesAreInSelection(blockedCoordinates, coordinates));
}

export const returnValidCoordinatesFromRange = (range: BoardCoordinates[]): BoardCoordinates[] => {
  return range.filter(coordinates => areCoordinatesOnBoard(coordinates));
}
