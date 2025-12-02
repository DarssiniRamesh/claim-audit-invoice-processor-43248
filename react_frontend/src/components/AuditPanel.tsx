import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography
} from '@mui/material';
import { useAudit } from '../hooks/invoices';
import type { AuditFindingOut, PurchaseLineItemAudit } from '../types/api';

export interface AuditPanelProps {
  invoiceId?: string;
}

/**
 * Format a number to a fixed 2-decimal string or '-' if not provided.
 */
function formatAmount(value?: number | null): string {
  if (value === null || typeof value === 'undefined') return '-';
  // limit precision to avoid long floats
  return Number(value).toFixed(2);
}

/**
 * Format a fraction (e.g., 0.0825) into a percentage string (e.g., 8.25%).
 */
function formatPercent(value?: number | null): string {
  if (value === null || typeof value === 'undefined') return '-';
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Render a severity chip for general findings.
 */
function SeverityChip({ severity }: { severity: string }): JSX.Element {
  const lower = severity.toUpperCase();
  const color = lower === 'ERROR' ? 'error' : lower === 'WARNING' ? 'warning' : 'default';
  const variant = lower === 'INFO' ? 'outlined' : 'filled';
  return <Chip label={severity} size="small" color={color as any} variant={variant as any} />;
}

/**
 * Render a status chip for tax validation status per purchase line.
 */
function TaxStatusChip({ ok }: { ok?: boolean | null }): JSX.Element {
  if (ok === true) return <Chip label="OK" color="success" size="small" />;
  if (ok === false) return <Chip label="Mismatch" color="error" size="small" />;
  return <Chip label="N/A" size="small" variant="outlined" />;
}

// PUBLIC_INTERFACE
export default function AuditPanel({ invoiceId }: AuditPanelProps): JSX.Element {
  /** Panel displaying audit findings for a given invoice with General and Purchase sections. */
  const { data, isLoading, isError, error } = useAudit(invoiceId);

  const generalFindings: AuditFindingOut[] = data?.general?.findings ?? [];
  const taxRateInferred = data?.purchase?.tax_rate_inferred ?? null;
  const purchaseItems: PurchaseLineItemAudit[] = data?.purchase?.items ?? [];

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Audit</Typography>
      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography variant="body2">Running audit...</Typography>}
      {isError && <Alert severity="error"><AlertTitle>Error</AlertTitle>{(error as Error).message}</Alert>}

      {!isLoading && !isError && (
        <Stack spacing={3}>
          {/* General Audit Section */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>General Audit</Typography>
              <Chip
                size="small"
                variant="outlined"
                label={`${generalFindings.length} finding${generalFindings.length === 1 ? '' : 's'}`}
              />
            </Stack>
            <Stack spacing={1}>
              {generalFindings.length === 0 && (
                <Typography variant="body2" color="text.secondary">No general findings.</Typography>
              )}
              {generalFindings.map((f) => (
                <Box key={f.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <SeverityChip severity={f.severity} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{f.code}</Typography>
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 200 }}>{f.message}</Typography>
                  {f.line_item_id != null && (
                    <Chip label={`Item #${f.line_item_id}`} size="small" variant="outlined" />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Purchase Audit Section */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Purchase Audit</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" color="secondary" variant="outlined" label={`Inferred Tax Rate: ${formatPercent(taxRateInferred)}`} />
                <Chip size="small" variant="outlined" label={`${purchaseItems.length} line${purchaseItems.length === 1 ? '' : 's'}`} />
              </Stack>
            </Stack>

            {purchaseItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No purchase audit entries.</Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small" aria-label="purchase audit table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item ID</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Tax Extracted</TableCell>
                      <TableCell align="right">Expected Tax</TableCell>
                      <TableCell align="right">Rate Used</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseItems.map((it) => (
                      <TableRow key={it.line_item_id} hover>
                        <TableCell>{it.line_item_id}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography variant="body2" noWrap title={it.description}>{it.description}</Typography>
                        </TableCell>
                        <TableCell align="right">{formatAmount(it.quantity)}</TableCell>
                        <TableCell align="right">{formatAmount(it.unit_price)}</TableCell>
                        <TableCell align="right">{formatAmount(it.total_price)}</TableCell>
                        <TableCell align="right">{formatAmount(it.tax_amount)}</TableCell>
                        <TableCell align="right">{formatAmount(it.expected_tax)}</TableCell>
                        <TableCell align="right">{formatPercent(it.tax_rate_used)}</TableCell>
                        <TableCell><TaxStatusChip ok={it.tax_ok} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Stack>
      )}
    </Paper>
  );
}
