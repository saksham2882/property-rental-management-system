export type MaintenanceStatus = 'pending' | 'in_progress' | 'resolved';
export type MaintenanceUrgency = 'low' | 'medium' | 'high';

export interface MaintenanceRequest {
  id?: string;
  propertyId: string;
  tenantId: string;
  category: string;
  description: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  raisedAt?: string;
  resolvedAt?: string | null;
  adminNote?: string;
  images?: string[];
}

// Config-driven dynamic form fields for maintenance
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const MAINTENANCE_FORM_CONFIG: FormFieldConfig[] = [
  {
    name: 'category',
    label: 'Issue Category',
    type: 'select',
    required: true,
    options: ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Other']
  },
  {
    name: 'description',
    label: 'Issue Description',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the issue in detail...'
  },
  {
    name: 'urgency',
    label: 'Urgency Level',
    type: 'select',
    required: true,
    options: ['low', 'medium', 'high']
  }
];
