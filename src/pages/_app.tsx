import type { AppProps } from 'next/app';
import { trpc } from '../libs/trpc';
import 'marx-css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(App);
