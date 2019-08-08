export class GamePiece {
    name: string;
    initialMoveSet: MoveSet;
    flippedMoveSet: MoveSet;
    isFlipped: boolean;
    position: BoardCoordinates;
    
    constructor(name: string, startingPosition: BoardCoordinates) {
        this.name = name;
        this.initialMoveSet = new MoveSet();
        this.flippedMoveSet = new MoveSet();
        this.isFlipped = false;
        this.position = startingPosition
    }
}

export class MoveSet {
    move: Array<BoardCoordinates> | null;
    jump: Array<BoardCoordinates> | null;
    slide: Array<BoardCoordinates> | null;
    jumpSlide: Array<BoardCoordinates> | null;
    strike: Array<BoardCoordinates> | null;
    command: Array<BoardCoordinates> | null;

    constructor(
        move?: Array<BoardCoordinates>,
        jump?: Array<BoardCoordinates>,
        slide?: Array<BoardCoordinates>,
        jumpSlide?: Array<BoardCoordinates>,
        strike?: Array<BoardCoordinates>,
        command?: Array<BoardCoordinates>,
    ) {
        this.move = move ? move : null;
        this.jump = jump ? jump : null;
        this.slide = slide ? slide : null;
        this.jumpSlide = jumpSlide ? jumpSlide : null;
        this.strike = strike ? strike : null;
        this.command = command ? command : null;
    }
}

export type BoardCoordinates = {x: number, y: number};