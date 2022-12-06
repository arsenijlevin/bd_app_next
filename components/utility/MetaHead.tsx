import Head from 'next/head';
import React, { Component } from 'react';

type Props = {
  title: string;
};

export default class MetaHead extends Component<Props> {
  render() {
    return (
      <Head>
        <title>{this.props.title}</title>
      </Head>
    );
  }
}
