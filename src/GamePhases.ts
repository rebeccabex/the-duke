
export type GameStage = 'Start' | 'Setup' | 'Playing' | 'Finished';

export type GamePhase = SetupPhase | PlayingPhase | null;

export type SetupPhase = 'PlacingDuke' | 'PlacingFootsoldier1' | 'PlacingFootsoldier2'

export type PlayingPhase = 'ChoosingMove' | 'MovingPiece' | 'PlacingPiece';