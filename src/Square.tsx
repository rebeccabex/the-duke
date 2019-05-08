import React from 'react';
import './square.css';

export class Square extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {

    return(
      <button className="square" onClick={() => alert("Button pressed")}>
      </button>
    )
  }
}