import React, { Component } from 'react';
import Cell from '../cell/Cell';

import styles from './row.module.scss';

type Props = {
  data: string[];
};

export default class Row extends Component<Props> {
  render() {
    return (
      <div className={styles.row}>
        {this.props.data.map((title, i) => (
          <Cell text={title} key={i}></Cell>
        ))}
      </div>
    );
  }
}
