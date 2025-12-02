/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

test('renders app bar title', () => {
  const qc = new QueryClient();
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
  const heading = screen.getByText(/Claim Audit Invoice Processor/i);
  expect(heading).toBeInTheDocument();
});
