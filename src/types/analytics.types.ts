export interface AnalyticsFilters {
  from?:   string;   // YYYY-MM-DD
  to?:     string;
  breed?:  string;
  sector?: string;
}

export interface ActivityPoint {
  ts:    string;
  avgKm: number;
}

export interface TemperatureBucket {
  range: string;   // e.g. '38.0–38.5'
  count: number;
}

export interface HeatmapCell {
  animalId:   string;
  animalName: string;
  hour:       number;  // 0–23
  value:      number;  // 0–1 normalizado
}

export interface AnimalRisk {
  animalId:   string;
  animalName: string;
  breed:      string;
  riskScore:  number;  // 0–100
  riskLabel:  'LOW' | 'MEDIUM' | 'HIGH';
  topFactors: string[];
}

export interface Prediction {
  animalId:    string;
  riskScore:   number;
  riskLabel:   'LOW' | 'MEDIUM' | 'HIGH';
  topFactors:  string[];
  predictedAt: string;
}
