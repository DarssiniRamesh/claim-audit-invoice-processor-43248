import React from 'react';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import type { InvoiceOut } from '../types/api';

export interface InvoiceFormProps {
  invoice?: InvoiceOut;
  onChange: (patch: Partial<InvoiceOut>) => void;
}

// PUBLIC_INTERFACE
export default function InvoiceForm({ invoice, onChange }: InvoiceFormProps): JSX.Element {
  /** Editable form for invoice header fields. */
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Invoice Header</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Vendor Name"
            value={invoice?.vendor_name ?? ''}
            onChange={(e) => onChange({ vendor_name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Invoice Number"
            value={invoice?.invoice_number ?? ''}
            onChange={(e) => onChange({ invoice_number: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Invoice Date"
            value={invoice?.invoice_date ?? ''}
            onChange={(e) => onChange({ invoice_date: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Currency"
            value={invoice?.currency ?? ''}
            onChange={(e) => onChange({ currency: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Subtotal"
            type="number"
            value={invoice?.subtotal ?? ''}
            onChange={(e) => onChange({ subtotal: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Tax"
            type="number"
            value={invoice?.tax ?? ''}
            onChange={(e) => onChange({ tax: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Total"
            type="number"
            value={invoice?.total ?? ''}
            onChange={(e) => onChange({ total: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Grand Total"
            type="number"
            value={invoice?.grand_total ?? ''}
            onChange={(e) => onChange({ grand_total: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
