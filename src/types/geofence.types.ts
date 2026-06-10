export interface Geofence {
  id:        string;
  name:      string;
  color:     string;
  vertices:  [number, number][];
  isActive:  boolean;
  farmId:    string;
  createdAt: string;
}

export interface CreateGeofenceDto {
  name:     string;
  color:    string;
  vertices: [number, number][];
}

export interface GeofenceBreachEvent {
  animalId:     string;
  animalName:   string;
  geofenceId:   string;
  geofenceName: string;
  type:         'enter' | 'exit';
  ts:           string;
}
