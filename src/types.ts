export interface CustomFormField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'select' | 'tel';
  required: boolean;
  options?: string[]; // for select
  defaultValue?: string;
  visible: boolean;
}

export interface BrandingConfig {
  companyName: string;
  subtitle: string;
  branchTag: string;
  logoUrl: string | null; // Data URL or image path
  logoType: 'image' | 'icon' | 'text';
  primaryColor: string; // e.g. '#0d472b'
  accentGradient: string; // CSS gradient string
  currency: string;
  footerText: string;
  showAgencyCredit: boolean;
  agencyCreditText: string;
}

export interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  createdAt: string;
  customerNationalId: string;
  customerName: string;
  customerPhone: string;
  tier: string;
  deviceModel: string;
  imeiNumber: string;
  amount: number;
  currency: string;
  branch: string;
  agentName?: string;
  paymentMethod: string;
  customFieldsData?: Record<string, string>;
  brandingSnapshot: {
    companyName: string;
    subtitle: string;
    branchTag: string;
    logoUrl: string | null;
  };
}
