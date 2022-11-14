import React, { Component } from 'react';

type Props = {
  text: string;
};

export default class Cell extends Component<Props> {
  render() {
    return (
      <div>
        <p>{this.props.text}</p>
      </div>
    );
  }
}
