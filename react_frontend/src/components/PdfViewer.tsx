import React from 'react';
import { Paper, Typography } from '@mui/material';

export interface PdfViewerProps {
  src?: string; // URL or blob URL
  height?: number;
}

// PUBLIC_INTERFACE
export default function PdfViewer({ src, height = 600 }: PdfViewerProps): JSX.Element {
  /** Render a PDF document if src is provided, otherwise show a friendly placeholder. */
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      {src ? (
        <object data={src} type="application/pdf" width="100%" height={height}>
          <embed src={src} type="application/pdf" />
          <Typography variant="body2" color="text.secondary">
            PDF preview is not supported in this browser.
          </Typography>
        </object>
      ) : (
        <Typography variant="body2" color="text.secondary">No PDF preview available.</Typography>
      )}
    </Paper>
  );
}
