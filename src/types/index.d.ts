interface Patient {
  name: string;
  type: PatientType;
  ownerName: string;
  ownerAddress: string;
  ownerPhoneNumber: string;
}

type PatientType = 'cat' | 'dog' | 'bird';

type ErrorName =
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'INTERNAL_SERVER';

interface ErrorResponseBody {
  name: ErrorName;
  status: boolean;
  message: string;
}

interface Appointment {
  patient: string | import('../models/patient.model').PatientDocument;
  startTime: Date;
  endTime: Date;
  description: string;
  feePaidBy: AppointmentPaidBy;
  amount: number;
}

type AppointmentPaidBy = 'USD' | 'EUR' | 'BTC' | 'UNPAID';

type ReportPeriod = 'month' | 'week';

type ReportType = 'paid' | 'unpaid';
