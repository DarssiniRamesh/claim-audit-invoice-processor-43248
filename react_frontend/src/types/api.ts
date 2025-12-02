export type Nullable<T> = T | null;

export interface AuditFindingOut {
  id: number;
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | string;
  line_item_id?: Nullable<number>;
}

export interface AuditReport {
  invoice_id: string;
  findings: AuditFindingOut[];
}

export interface BenchmarkOut {
  id: number;
  category: string;
  unit: string;
  min_price: number;
  max_price: number;
}

export interface InvoiceListItem {
  id: string;
  vendor_name: Nullable<string>;
  invoice_number: Nullable<string>;
  invoice_date: Nullable<string>; // date (YYYY-MM-DD)
  total: Nullable<number>;
  grand_total: Nullable<number>;
  created_at: Nullable<string>;
}

export interface InvoiceListResponse {
  items: InvoiceListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface LineItemOut {
  id: number;
  description: string;
  quantity: Nullable<number>;
  unit: Nullable<string>;
  unit_price: Nullable<number>;
  total_price: Nullable<number>;
  category: Nullable<string>;
  normalized_unit: Nullable<string>;
  normalized_quantity: Nullable<number>;
  normalized_unit_price: Nullable<number>;
  flagged_high_value: boolean;
}

export interface InvoiceOut {
  id: string;
  vendor_name?: Nullable<string>;
  invoice_number?: Nullable<string>;
  invoice_date?: Nullable<string>;
  currency?: Nullable<string>;
  subtotal?: Nullable<number>;
  tax?: Nullable<number>;
  total?: Nullable<number>;
  grand_total?: Nullable<number>;
  status: string;
  line_items?: LineItemOut[];
}

export interface LineItemUpdate {
  id: number;
  description?: Nullable<string>;
  quantity?: Nullable<number>;
  unit?: Nullable<string>;
  unit_price?: Nullable<number>;
  total_price?: Nullable<number>;
  category?: Nullable<string>;
}

export interface ValidateRequest {
  header_updates?: Record<string, unknown>;
  line_item_updates?: LineItemUpdate[];
  comment?: Nullable<string>;
}

export interface ValidateResponse {
  invoice: InvoiceOut;
}

export interface UploadResponse {
  invoice_id: string;
}
