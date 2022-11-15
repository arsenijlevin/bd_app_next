import React, { Component } from 'react';

import styles from './cell.module.scss';

type Props = {
  text: string;
};

export default class Cell extends Component<Props> {
  render() {
    return (
      <div className={styles.cell}>
        <p>{this.props.text}</p>
      </div>
    );
  }
}
