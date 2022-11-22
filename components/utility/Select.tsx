import React, { Component } from 'react';

type Props = {
  options: string[];
  id: string;
};

export default class Select extends Component<Props> {
  render() {
    return (
      <select id={this.props.id} name={this.props.id}>
        {this.props.options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    );
  }
}
