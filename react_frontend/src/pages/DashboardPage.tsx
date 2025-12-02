import React from 'react';
import {
  Alert,
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useInvoicesList } from '../hooks/invoices';

const DEFAULT_LIMIT = 20;

// PUBLIC_INTERFACE
export default function DashboardPage(): JSX.Element {
  /** Dashboard with invoice search, pagination, and quick access to details. */
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, error } = useInvoicesList({
    q: q || undefined,
    limit: DEFAULT_LIMIT,
    offset: (page - 1) * DEFAULT_LIMIT
  });

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / DEFAULT_LIMIT));

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Invoices</Typography>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Search (vendor or invoice #)"
            fullWidth
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <Button component={Link} to="/upload" variant="contained" color="primary">
            Upload Invoice
          </Button>
        </Stack>
      </Paper>

      {isError && <Alert severity="error">{error.message}</Alert>}

      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Invoice #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Grand Total</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
            )}
            {!isLoading && data?.items?.length === 0 && (
              <TableRow><TableCell colSpan={7}>No invoices found</TableCell></TableRow>
            )}
            {data?.items?.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell>{inv.vendor_name ?? '-'}</TableCell>
                <TableCell>{inv.invoice_number ?? '-'}</TableCell>
                <TableCell>{inv.invoice_date ?? '-'}</TableCell>
                <TableCell align="right">{inv.total ?? '-'}</TableCell>
                <TableCell align="right">{inv.grand_total ?? '-'}</TableCell>
                <TableCell>{inv.created_at ?? '-'}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/invoices/${inv.id}`} size="small" variant="outlined">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center">
        <Pagination
          color="primary"
          page={page}
          onChange={(_, p) => setPage(p)}
          count={pageCount}
        />
      </Box>
    </Stack>
  );
}
