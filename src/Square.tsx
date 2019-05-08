import React from 'react';
import './square.css';

interface ISquareProps {
    coordinates: number[]
}

export class Square extends React.Component <ISquareProps> {
  constructor(props: any) {
    super(props)
  }

  render() {

    return(
      <button className="square" onClick={() => alert(this.props.coordinates)}>
        {this.props.coordinates}
      </button>
    )
  }
}