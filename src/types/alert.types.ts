export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus   = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id:           string;
  title:        string;
  description:  string;
  severity:     AlertSeverity;
  status:       AlertStatus;
  animalId?:    string;
  animalName?:  string;
  geofenceId?:  string;
  geofenceName?: string;
  assignedTo?:  string;
  createdAt:    string;
  updatedAt:    string;
}

export interface AlertFiltersParams {
  severity?: AlertSeverity;
  status?:   AlertStatus;
  search?:   string;
}
