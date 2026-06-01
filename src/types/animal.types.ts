export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'PREGNANT';
export type AnimalSex    = 'MALE' | 'FEMALE';

export interface AnimalSummary {
  id:           string;
  code:         string;
  name?:        string;
  breed:        string;
  sex:          AnimalSex;
  healthStatus: HealthStatus;
  lastSeen?:    string;
}

export interface AnimalDetail extends AnimalSummary {
  birthDate?: string;
  weight?:    number;
  notes?:     string;
  photoUrl?:  string;
  deviceId?:  string;
  farmId:     string;
  createdAt:  string;
}

export interface CreateAnimalDto {
  code:         string;
  name?:        string;
  breed:        string;
  sex:          AnimalSex;
  healthStatus: HealthStatus;
  birthDate?:   string;
  weight?:      number;
  deviceId?:    string;
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
