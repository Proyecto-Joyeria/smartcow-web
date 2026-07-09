export type HealthStatus = 'HEALTHY' | 'SICK' | 'RECOVERING' | 'UNDER_OBSERVATION' | 'CRITICAL';
export type Breed        = 'BRAHMAN' | 'HOLSTEIN' | 'ANGUS' | 'SIMMENTAL' | 'CEBUINO' | 'OTRO';
export type AnimalSex    = 'M' | 'F';

export const BREED_LABELS: Record<Breed, string> = {
  BRAHMAN:   'Brahman',
  HOLSTEIN:  'Holstein',
  ANGUS:     'Angus',
  SIMMENTAL: 'Simmental',
  CEBUINO:   'Cebuino',
  OTRO:      'Otro',
};

export interface AnimalSummary {
  id:           string;
  code:         string;
  name?:        string;
  breed:        Breed;
  sex:          AnimalSex;
  healthStatus: HealthStatus;
  lastSeen?:    string;
}

export interface AnimalDetail extends AnimalSummary {
  birthDate?:   string;
  weightKg?:    number;
  notes?:       string;
  photoUrl?:    string;
  areteNumber?: string;
  farmId:       string;
  createdAt:    string;
}

export interface CreateAnimalDto {
  code:         string;
  name?:        string;
  breed:        Breed;
  sex:          AnimalSex;
  healthStatus: HealthStatus;
  birthDate?:   string;
  weightKg?:    number;
  areteNumber?: string;
  notes?:       string;
}

export interface VitalReading {
  value:   number;
  unit:    string;
  trend:   '↑' | '↓' | '↔';
  history: number[];
}

export interface AnimalVitals {
  temperature: VitalReading;
  heartRate:   VitalReading;
  activity:    VitalReading;
  battery:     VitalReading;
}
