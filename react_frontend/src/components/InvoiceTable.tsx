import React from 'react';
import {
  Chip,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography
} from '@mui/material';
import type { LineItemOut } from '../types/api';

export interface InvoiceTableProps {
  items: LineItemOut[];
  onItemChange: (id: number, patch: Partial<LineItemOut>) => void;
}

// PUBLIC_INTERFACE
export default function InvoiceTable({ items, onItemChange }: InvoiceTableProps): JSX.Element {
  /** Editable table for invoice line items with high-value flag indicators. */
  return (
    <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Line Items</Typography>
      <Table size="small" aria-label="invoice line items">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell sx={{ minWidth: 220 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={row.description ?? ''}
                  onChange={(e) => onItemChange(row.id, { description: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="standard"
                  value={row.quantity ?? ''}
                  onChange={(e) => onItemChange(row.id, { quantity: e.target.value === '' ? null : Number(e.target.value) })}
                  inputProps={{ step: '0.01' }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  value={row.unit ?? ''}
                  onChange={(e) => onItemChange(row.id, { unit: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="standard"
                  value={row.unit_price ?? ''}
                  onChange={(e) => onItemChange(row.id, { unit_price: e.target.value === '' ? null : Number(e.target.value) })}
                  inputProps={{ step: '0.01' }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="standard"
                  value={row.total_price ?? ''}
                  onChange={(e) => onItemChange(row.id, { total_price: e.target.value === '' ? null : Number(e.target.value) })}
                  inputProps={{ step: '0.01' }}
                />
              </TableCell>
              <TableCell sx={{ minWidth: 160 }}>
                <TextField
                  variant="standard"
                  value={row.category ?? ''}
                  onChange={(e) => onItemChange(row.id, { category: e.target.value })}
                />
              </TableCell>
              <TableCell>
                {row.flagged_high_value ? (
                  <Chip label="High" color="error" size="small" />
                ) : (
                  <Chip label="OK" color="success" size="small" variant="outlined" />
                )}
              </TableCell>
            </TableRow>
          ))}
          {(!items || items.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                No line items
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
