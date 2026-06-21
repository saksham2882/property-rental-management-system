export type RentStatus = 'paid' | 'pending' | 'overdue';

export interface Rent {
  id: string;
  leaseId: string;
  tenantId: string;
  month: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: RentStatus;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}
