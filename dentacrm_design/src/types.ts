export enum ToothStatus {
  HEALTHY = "healthy",
  CAVITY = "cavity",
  FILLING = "filling",
  CROWN = "crown",
  MISSING = "missing",
  IMPLANT = "implant",
  ROOT_CANAL = "root-canal",
}

export interface PatientTreatment {
  id: string;
  date: string;
  description: string;
  cost: number;
  status: "planned" | "completed";
  toothNumber?: number;
  dentistName: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  address: string;
  bloodType: string;
  allergies: string;
  notes: string;
  registeredAt: string;
  toothStates: Record<number, ToothStatus>; // Map tooth 1-32 to status
  treatments: PatientTreatment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  treatmentType: string;
  status: "scheduled" | "completed" | "cancelled";
  chairNumber: number; // 1, 2, 3
  notes: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  color: string; // Hex color for schedules
  photoUrl: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number; // Alert threshold
  lastRestocked: string;
  pricePerUnit: number;
  supplier: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  patientId?: string;
  patientName?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number; // percentage
  activePatients: number;
  appointmentsCount: number;
  treatmentCompletionRate: number; // percentage
}
