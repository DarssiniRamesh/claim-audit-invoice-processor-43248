import React from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  /** Main application shell with top app bar and route configuration. */
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: (t) => t.palette.background.default }}>
      <AppBar position="sticky" elevation={1} color="default" sx={{ background: (t) => t.palette.background.paper }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: (t) => t.palette.text.primary }}>
            Claim Audit Invoice Processor
          </Typography>
          <Button
            component={Link}
            color={location.pathname === '/' ? 'secondary' : 'inherit'}
            to="/"
            sx={{ mr: 1 }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            color={location.pathname === '/upload' ? 'secondary' : 'inherit'}
            to="/upload"
          >
            Upload
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
