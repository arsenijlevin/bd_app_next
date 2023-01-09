import { NextPageContext } from 'next';
import React from 'react';
import MetaHead from '../components/utility/MetaHead';
import { getInitialIndexProps } from '../lib/auth/helpers';

Home.getInitialProps = (ctx: NextPageContext) => getInitialIndexProps(ctx);

export default function Home(): JSX.Element {
  return <MetaHead title="Платная клиника"></MetaHead>;
}
