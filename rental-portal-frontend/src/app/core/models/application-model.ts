export type ApplicationStatus = 'under_review' | 'approved' | 'rejected' | 'waitlisted';

export interface RentalApplication {
  id?: string;
  propertyId: string;
  customerId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  moveInDate: string;
  monthlyIncome: number;
  occupants: number;
  message: string;
  status: ApplicationStatus;
  documents: string[];
  appliedAt?: string;
}
