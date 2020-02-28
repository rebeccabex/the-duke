import React from 'react';
import { GamePiece } from 'GamePiece';

interface IBagProps {
  colour: string,
  pieces: GamePiece[],
  ableToDraw: boolean,
  drawFromBag: () => any,
}

const displayBagPieces = (pieces: GamePiece[]): JSX.Element => {
  var piecesElement = new Array<JSX.Element>();
  pieces.forEach(piece => 
    piecesElement.push(<div>{piece.name}</div>)
  );
  return <div>{piecesElement}</div>;
}

export const Bag = (props: IBagProps) => {
  return(
    <div>
      <h4>{props.colour}'s Bag</h4>
      {props.ableToDraw && <button onClick={props.drawFromBag}>Draw</button>}
      <div>{displayBagPieces}</div>
    </div>
  )
}