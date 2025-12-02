import React from 'react';
import { Alert, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { buildHeaderUpdates, toLineItemUpdate, useInvoice, useValidateInvoice } from '../hooks/invoices';
import type { InvoiceOut, LineItemOut, LineItemUpdate, ValidateRequest } from '../types/api';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceTable from '../components/InvoiceTable';
import AuditPanel from '../components/AuditPanel';
import PdfViewer from '../components/PdfViewer';

// PUBLIC_INTERFACE
export default function InvoiceDetailPage(): JSX.Element {
  /** Detailed invoice review page with editable fields and audit findings. */
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { data: invoice, isLoading, isError, error } = useInvoice(invoiceId);
  const { mutate: doValidate, isPending: isSaving, isError: isSaveError, error: saveError } = useValidateInvoice(invoiceId || '');

  const [header, setHeader] = React.useState<InvoiceOut | undefined>(invoice);
  const [items, setItems] = React.useState<LineItemOut[]>(invoice?.line_items ?? []);
  const [itemPatches, setItemPatches] = React.useState<Map<number, Partial<LineItemOut>>>(new Map());

  React.useEffect(() => {
    if (invoice) {
      setHeader(invoice);
      setItems(invoice.line_items || []);
      setItemPatches(new Map());
    }
  }, [invoice]);

  const onHeaderChange = (patch: Partial<InvoiceOut>) => {
    setHeader((prev) => ({ ...(prev || {} as InvoiceOut), ...patch }));
  };

  const onItemChange = (id: number, patch: Partial<LineItemOut>) => {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, ...patch } : it));
    setItemPatches((prev) => {
      const next = new Map(prev);
      next.set(id, { ...(next.get(id) || {}), ...patch });
      return next;
    });
  };

  const onSave = () => {
    if (!invoice || !header) return;
    const header_updates = buildHeaderUpdates(invoice, header);
    const line_item_updates: LineItemUpdate[] = Array.from(itemPatches.entries()).map(([id, patch]) => toLineItemUpdate({ id, ...patch }));
    const payload: ValidateRequest = { header_updates, line_item_updates: line_item_updates.length ? line_item_updates : undefined };
    doValidate(payload);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Invoice Detail</Typography>
      {isError && <Alert severity="error">{(error as Error).message}</Alert>}

      {isLoading && <Typography>Loading...</Typography>}

      {!isLoading && invoice && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <PdfViewer />
            <InvoiceForm invoice={header} onChange={onHeaderChange} />
            <InvoiceTable items={items} onItemChange={onItemChange} />
            <Paper elevation={0} sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Paper>
            {isSaveError && <Alert sx={{ mt: 1 }} severity="error">{(saveError as Error).message}</Alert>}
          </Grid>
          <Grid item xs={12} md={4}>
            <AuditPanel invoiceId={invoiceId} />
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
