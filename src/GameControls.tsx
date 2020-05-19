import React from 'react';
import { GameStage, GamePhase } from 'GamePhases';
import { Player } from 'Player';
import { GamePiece } from 'GamePiece';

interface GameControlProps {
  gameStage: GameStage,
  gamePhase: GamePhase,
  currentPlayer: Player,
  waitingPlayer: Player,
  currentPlayerIsOnGuard: boolean,
  canDrawFromBag: boolean,
  pieceToPlace: GamePiece | null,
  startGame: () => any,
}

const setGameControls = (props: GameControlProps) => {
  const { waitingPlayer, currentPlayer, gameStage, gamePhase } = props;
  var gameInstruction = '';
  switch(gameStage) {
    case 'Start':
      return <button className="start-button" onClick={props.startGame}>{'Start game'}</button>;
    case 'Setup':
      switch(gamePhase) {
        case 'PlacingDuke':
          gameInstruction = `${currentPlayer.colour}, choose where to place your Duke`;
          break;
        case 'PlacingFootsoldier1':
        case 'PlacingFootsoldier2':
          gameInstruction = `${currentPlayer.colour}, choose where to place your Footsoldier`;
      }
      break;
    case 'Playing':
      if (props.currentPlayerIsOnGuard) {
        gameInstruction = 'GUARD! '
      }
      switch(gamePhase) {
        case 'ChoosingMove':
          gameInstruction += `${currentPlayer.colour}, make a move`;
          if (props.canDrawFromBag) {
            gameInstruction += ' or draw from your bag';
          }
          break;
        case 'MovingPiece':
          gameInstruction += `${currentPlayer.colour}, make a move`;
          break;
        case 'PlacingPiece': 
          gameInstruction += `${currentPlayer.colour}, choose where to place your ${props.pieceToPlace!.name}`;
          break;
      }
      break;
    case 'Finished':
      gameInstruction = `Congratulations, ${waitingPlayer.colour}`;
  }
  return <div className='game-instruction'>{gameInstruction}</div>;
}

export const GameControls = (props: GameControlProps) => {

  return (
    <div>
      {setGameControls(props)}
    </div>
  );
}