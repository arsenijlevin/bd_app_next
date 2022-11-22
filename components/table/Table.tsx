import React, { Component } from 'react';
import Row from './row/Row';

import styles from './table.module.scss';

type Props = {
  headerTitles: string[];
  data: string[][];
};

export default class Table extends Component<Props> {
  render() {
    const tableHeader = (
      <Row data={this.props.headerTitles} isHeader={true}></Row>
    );
    return (
      <div className={styles.table}>
        {tableHeader}

        {this.props.data.map((rowData, index) => (
          <Row data={rowData} key={index}></Row>
        ))}
      </div>
    );
  }
}
