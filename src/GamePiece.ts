export class GamePiece {
    name: string;
    initialMoveSet: MoveSet;
    flippedMoveSet: MoveSet;
    isFlipped: boolean;
    position: Coordinates;
    
    constructor(name: string, startingPosition: Coordinates) {
        this.name = name;
        this.initialMoveSet = new MoveSet();
        this.flippedMoveSet = new MoveSet();
        this.isFlipped = false;
        this.position = startingPosition
    }
}

export class MoveSet {
    move: Array<Coordinates> | null;
    jump: Array<Coordinates> | null;
    slide: Array<Coordinates> | null;
    jumpSlide: Array<Coordinates> | null;
    strike: Array<Coordinates> | null;
    command: Array<Coordinates> | null;

    constructor(
        move?: Array<Coordinates>,
        jump?: Array<Coordinates>,
        slide?: Array<Coordinates>,
        jumpSlide?: Array<Coordinates>,
        strike?: Array<Coordinates>,
        command?: Array<Coordinates>,
    ) {
        this.move = move ? move : null;
        this.jump = jump ? jump : null;
        this.slide = slide ? slide : null;
        this.jumpSlide = jumpSlide ? jumpSlide : null;
        this.strike = strike ? strike : null;
        this.command = command ? command : null;
    }
}

type Coordinates = {x: number, y: number};