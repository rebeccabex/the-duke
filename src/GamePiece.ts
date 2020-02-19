import { BoardCoordinates, applyMoveToCoordinates, areValidCoordinates, coordinatesEqual, applyRangeOfMovesToCoordinates, returnValidCoordinatesFromRange } from "GameBoard";
import { Player } from "Player";

export class GamePiece {
  name: string;
  initialMoveSet: MoveSet;
  flippedMoveSet: MoveSet;
  isFlipped: boolean;
  position: BoardCoordinates | null;
  
  constructor(name: string, startingPosition: BoardCoordinates | null = null) {
    this.name = name;
    this.initialMoveSet = new MoveSet();
    this.flippedMoveSet = new MoveSet();
    this.isFlipped = false;
    this.position = startingPosition
  }
}

export class MoveSet {
  moves: Array<BoardCoordinates>;
  jumps: Array<BoardCoordinates>;
  slides: Array<BoardCoordinates>;
  jumpSlides: Array<BoardCoordinates>;
  strikes: Array<BoardCoordinates>;
  commands: Array<BoardCoordinates>;

  constructor(
    move?: Array<BoardCoordinates>,
    jump?: Array<BoardCoordinates>,
    slide?: Array<BoardCoordinates>,
    jumpSlide?: Array<BoardCoordinates>,
    strike?: Array<BoardCoordinates>,
    command?: Array<BoardCoordinates>,
  ) {
    this.moves = move ? move : [];
    this.jumps = jump ? jump : [];
    this.slides = slide ? slide : [];
    this.jumpSlides = jumpSlide ? jumpSlide : [];
    this.strikes = strike ? strike : [];
    this.commands = command ? command : [];
  }

  // TODO: Add ability to handle more human-readable descriptions 'Slide: Left'
  addMoves(landingSquares: Array<BoardCoordinates>) {
    this.moves.push(...landingSquares);
  }

  addJumps(landingSquares: Array<BoardCoordinates>) {
    this.jumps.push(...landingSquares);
  }

  addSlides(directions:  Array<BoardCoordinates>) {
    this.slides.push(...directions);
  }

  addJumpSlide(directions: Array<BoardCoordinates>) {
    this.jumpSlides.push(...directions);
  }

  addStrikeSpots(targetSquares: Array<BoardCoordinates>) {
    this.strikes.push(...targetSquares);
  }

  addCommandSpots(targetSquares: Array<BoardCoordinates>) {
    this.commands.push(...targetSquares);
  }

  getLegalTargetCoordinatesForCurrentCoordinatesForSingleSquareMoves(currentCoordinates: BoardCoordinates) {
    const legalSquares = new Array<BoardCoordinates>();
    [this.moves, this.jumps, this.strikes, this.commands].forEach(moveType =>
      moveType.forEach(move => {
        const newCoordinates = applyMoveToCoordinates(currentCoordinates, move);
        if (areValidCoordinates(newCoordinates) && !legalSquares.some(coordinates => coordinatesEqual(coordinates, newCoordinates))) {
          legalSquares.push(newCoordinates);
        }
      })
    );
    return legalSquares;
  }

  getLegalTargetCoordinatesForCurrentCoordinatesForRangeMoves(currentCoordinates: BoardCoordinates) {
    const legalSquares = new Array<BoardCoordinates>();
    [this.slides, this.jumpSlides].forEach(moveType => {
      moveType.forEach(move => {
        const newCoordinatesRange = applyRangeOfMovesToCoordinates(currentCoordinates, move);
        legalSquares
          .push(...returnValidCoordinatesFromRange(newCoordinatesRange)
          .filter(coordinates => !legalSquares.some(legalCoordinates => coordinatesEqual(legalCoordinates, coordinates))));
      })
   });
   return legalSquares;
  }
}

export type PlayerPiece = {
  player: Player,
  piece: GamePiece,
}