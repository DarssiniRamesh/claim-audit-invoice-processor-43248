import React from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useUploadInvoice } from '../hooks/invoices';
import PdfViewer from '../components/PdfViewer';

// PUBLIC_INTERFACE
export default function UploadPage(): JSX.Element {
  /** Upload invoice PDF via drag-and-drop to create a new invoice record. */
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(undefined);
  const { mutate, data, isPending, isError, error } = useUploadInvoice();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    mutate(file, {
      onSuccess: (res) => {
        navigate(`/invoices/${res.invoice_id}`);
      }
    });
  }, [mutate, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Upload Invoice</Typography>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          bgcolor: isDragActive ? 'primary.main' : 'transparent',
          color: isDragActive ? 'primary.contrastText' : 'inherit',
          transition: 'all 200ms ease'
        }}
      >
        <Box {...getRootProps()} sx={{ cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <UploadFileIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Drag & drop a PDF file here, or click to select
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only PDF files are accepted
          </Typography>
        </Box>
      </Paper>

      {isPending && <Typography>Uploading...</Typography>}
      {isError && <Alert severity="error">{error.message}</Alert>}
      {data?.invoice_id && (
        <Alert severity="success">
          Invoice uploaded. <Button component={RouterLink} to={`/invoices/${data.invoice_id}`} size="small">Open</Button>
        </Alert>
      )}

      <PdfViewer src={previewUrl} height={450} />
    </Stack>
  );
}
