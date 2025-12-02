export type Nullable<T> = T | null;

/**
 * Structured audit finding.
 */
export interface AuditFindingOut {
  id: number;
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | string;
  line_item_id?: Nullable<number>;
}

/**
 * General audit section that groups high-level invoice checks and rule-based findings.
 */
export interface GeneralAuditSection {
  findings: AuditFindingOut[];
}

/**
 * Per-purchase audit view with tax extraction and validation.
 */
export interface PurchaseLineItemAudit {
  line_item_id: number;
  description: string;
  quantity?: Nullable<number>;
  unit_price?: Nullable<number>;
  total_price?: Nullable<number>;
  currency?: Nullable<string>;
  tax_amount?: Nullable<number>;
  expected_tax?: Nullable<number>;
  tax_rate_used?: Nullable<number>;
  tax_ok?: Nullable<boolean>;
}

/**
 * Purchase audit section: inferred tax rate and per-line tax validation results.
 */
export interface PurchaseAuditSection {
  tax_rate_inferred?: Nullable<number>;
  items: PurchaseLineItemAudit[];
}

/**
 * Audit report for an invoice with General and Purchase sections.
 */
export interface AuditReport {
  invoice_id: string;
  general: GeneralAuditSection;
  purchase: PurchaseAuditSection;
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
  currency?: Nullable<string>;
  category: Nullable<string>;
  normalized_unit: Nullable<string>;
  normalized_quantity: Nullable<number>;
  normalized_unit_price: Nullable<number>;
  tax_amount?: Nullable<number>;
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
