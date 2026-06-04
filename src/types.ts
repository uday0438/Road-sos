export interface ServiceLocation {
  id: number;
  name: string;
  distance: string;
  readiness?: string;
  eta?: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface UserContext {
  lat: number | null;
  lng: number | null;
  hasLocation: boolean;
  bloodGroup: string | null;
  emergencyContact: string | null;
}
