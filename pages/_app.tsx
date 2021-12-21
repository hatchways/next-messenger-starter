import { MuiThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';

import { theme } from '../themes/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}
