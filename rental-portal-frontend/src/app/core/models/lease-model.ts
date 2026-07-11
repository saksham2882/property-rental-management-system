export interface Lease {
  id: string;
  applicationId: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated' | 'pending_signature';
  conditions: string;
  propertyTitle: string;
  signatureImage?: string;
  contractText?: string;
}
