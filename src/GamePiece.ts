import { BoardCoordinates } from "GameBoard";
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
    move: Array<BoardCoordinates>;
    jump: Array<BoardCoordinates>;
    slide: Array<BoardCoordinates>;
    jumpSlide: Array<BoardCoordinates>;
    strike: Array<BoardCoordinates>;
    command: Array<BoardCoordinates>;

    constructor(
        move?: Array<BoardCoordinates>,
        jump?: Array<BoardCoordinates>,
        slide?: Array<BoardCoordinates>,
        jumpSlide?: Array<BoardCoordinates>,
        strike?: Array<BoardCoordinates>,
        command?: Array<BoardCoordinates>,
    ) {
        this.move = move ? move : [];
        this.jump = jump ? jump : [];
        this.slide = slide ? slide : [];
        this.jumpSlide = jumpSlide ? jumpSlide : [];
        this.strike = strike ? strike : [];
        this.command = command ? command : [];
    }

    // TODO: Add ability to handle more human-readable descriptions 'Slide: Left'
    addMoves(landingSquares: Array<BoardCoordinates>) {
        this.move.push(...landingSquares);
    }

    addJumps(landingSquares: Array<BoardCoordinates>) {
        this.jump.push(...landingSquares);
    }

    addSlides(directions:  Array<BoardCoordinates>) {
        this.slide.push(...directions);
    }

    addJumpSlide(directions: Array<BoardCoordinates>) {
        this.jumpSlide.push(...directions);
    }

    addStrikeSpots(targetSquares: Array<BoardCoordinates>) {
        this.strike.push(...targetSquares);
    }

    addCommandSpots(targetSquares: Array<BoardCoordinates>) {
        this.command.push(...targetSquares);
    }
}

export type PlayerPiece = {
    player: Player,
    piece: GamePiece,
}