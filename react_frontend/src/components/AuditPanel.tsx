import React from 'react';
import { Alert, AlertTitle, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAudit } from '../hooks/invoices';

export interface AuditPanelProps {
  invoiceId?: string;
}

// PUBLIC_INTERFACE
export default function AuditPanel({ invoiceId }: AuditPanelProps): JSX.Element {
  /** Panel displaying audit findings for a given invoice. */
  const { data, isLoading, isError, error } = useAudit(invoiceId);

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Audit Findings</Typography>
      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography variant="body2">Running audit...</Typography>}
      {isError && <Alert severity="error"><AlertTitle>Error</AlertTitle>{error.message}</Alert>}
      {!isLoading && !isError && (!data || data.findings.length === 0) && (
        <Typography variant="body2" color="text.secondary">No findings.</Typography>
      )}

      <Stack spacing={1}>
        {data?.findings.map((f) => (
          <Box key={f.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={f.severity}
              size="small"
              color={f.severity === 'ERROR' ? 'error' : f.severity === 'WARNING' ? 'warning' : 'default'}
              variant={f.severity === 'INFO' ? 'outlined' : 'filled'}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{f.code}</Typography>
            <Typography variant="body2">{f.message}</Typography>
            {f.line_item_id != null && (
              <Chip label={`Item #${f.line_item_id}`} size="small" variant="outlined" />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
