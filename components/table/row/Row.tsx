import React, { Component } from 'react';
import Cell from '../cell/Cell';

import styles from './row.module.scss';

type Props = {
  data: string[];
  isHeader?: boolean;
};

export default class Row extends Component<Props> {
  render() {
    return (
      <div
        className={`${styles.row} ${
          this.props.isHeader ? styles['table-header'] : ''
        }`}
      >
        {this.props.data.map((title, i) => (
          <Cell text={title} key={i}></Cell>
        ))}
      </div>
    );
  }
}
