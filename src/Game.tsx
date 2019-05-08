import React from 'react';
import * as ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Board } from './Board';

function Game() {
  return (
    <div className="game">
        <div className="game-board">
            <Board  />
        </div>
        <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
        </div>
    </div>
  );
}

export default Game;
