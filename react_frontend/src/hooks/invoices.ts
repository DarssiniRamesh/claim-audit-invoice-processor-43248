import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  AuditReport,
  BenchmarkOut,
  InvoiceListResponse,
  InvoiceOut,
  LineItemUpdate,
  UploadResponse,
  ValidateRequest,
  ValidateResponse
} from '../types/api';

export interface InvoiceListParams {
  q?: string;
  vendor_name?: string;
  invoice_number?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
}

// PUBLIC_INTERFACE
export function useInvoicesList(params: InvoiceListParams) {
  /** Fetch paginated list of invoices with optional filters. */
  const safeParams = useMemo(() => ({
    limit: 20,
    offset: 0,
    ...params
  }), [params]);

  return useQuery<InvoiceListResponse, Error>({
    queryKey: ['invoices', safeParams],
    queryFn: async () => {
      const res = await api.get<InvoiceListResponse>('/api/invoices', { params: safeParams });
      return res.data;
    }
  });
}

// PUBLIC_INTERFACE
export function useInvoice(invoiceId?: string) {
  /** Fetch a single invoice by ID. */
  return useQuery<InvoiceOut, Error>({
    queryKey: ['invoice', invoiceId],
    enabled: Boolean(invoiceId),
    queryFn: async () => {
      const res = await api.get<InvoiceOut>(`/api/invoices/${invoiceId}`);
      return res.data;
    }
  });
}

// PUBLIC_INTERFACE
export function useAudit(invoiceId?: string) {
  /** Fetch audit report for an invoice. */
  return useQuery<AuditReport, Error>({
    queryKey: ['audit', invoiceId],
    enabled: Boolean(invoiceId),
    queryFn: async () => {
      const res = await api.get<AuditReport>(`/api/invoices/${invoiceId}/audit`);
      return res.data;
    }
  });
}

// PUBLIC_INTERFACE
export function useUploadInvoice() {
  /** Upload a PDF invoice file and receive created invoice ID. */
  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post<UploadResponse>('/api/invoices/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }
  });
}

// PUBLIC_INTERFACE
export function useValidateInvoice(invoiceId: string) {
  /** Apply user validation edits to an invoice; invalidates relevant cache on success. */
  const qc = useQueryClient();
  return useMutation<ValidateResponse, Error, ValidateRequest>({
    mutationFn: async (payload: ValidateRequest) => {
      const res = await api.put<ValidateResponse>(`/api/invoices/${invoiceId}/validate`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['audit', invoiceId] });
    }
  });
}

// PUBLIC_INTERFACE
export function useBenchmarks() {
  /** Retrieve pricing benchmarks used for normalization & comparison. */
  return useQuery<BenchmarkOut[], Error>({
    queryKey: ['benchmarks'],
    queryFn: async () => {
      const res = await api.get<BenchmarkOut[]>('/api/benchmarks');
      return res.data;
    }
  });
}

// PUBLIC_INTERFACE
export function buildHeaderUpdates(original: InvoiceOut, current: Partial<InvoiceOut>): Record<string, unknown> {
  /**
   * Utility to compute header updates comparing the edited form state with the original invoice.
   * Includes only fields that changed and are allowed by API: vendor_name, invoice_number, invoice_date, currency, subtotal, tax, total, grand_total
   */
  const fields: Array<keyof InvoiceOut> = [
    'vendor_name', 'invoice_number', 'invoice_date', 'currency',
    'subtotal', 'tax', 'total', 'grand_total'
  ];
  const updates: Record<string, unknown> = {};
  fields.forEach((k) => {
    const newVal = current[k];
    if (typeof newVal !== 'undefined' && newVal !== (original as any)[k]) {
      updates[k] = newVal;
    }
  });
  return updates;
}

// PUBLIC_INTERFACE
export function toLineItemUpdate(updates: Partial<LineItemUpdate> & { id: number }): LineItemUpdate {
  /** Normalize a line item update object to the schema expected by the API. */
  const allowed: (keyof LineItemUpdate)[] = ['id', 'description', 'quantity', 'unit', 'unit_price', 'total_price', 'category'];
  const out: any = { id: updates.id };
  allowed.forEach((k) => {
    if (k in updates && k !== 'id') {
      out[k] = (updates as any)[k];
    }
  });
  return out as LineItemUpdate;
}
