export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  capacity: number;
  sold: number;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
  startDate?: string;
  endDate?: string;
}

export interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  ciudad: string;
  imagen_url: string;
  categorias: string[];
  capacidad_total: number;
  activo: boolean;
  precio_min?: number;
  precio_max?: number;
  inicio_venta?: string;
  fin_venta?: string;
  ticketTypes?: TicketType[]; // New field for different ticket values
  sections?: Section[];
  discounts?: Discount[];
}

export interface Section {
  id: string;
  name: string;
  type: 'assigned' | 'general';
  capacity: number;
  price: number;
  rows?: number;
  seatsPerRow?: number;
  ticketTypeId?: string;
  visualX?: number; // 0-100
  visualY?: number; // 0-100
  width?: number; // 0-100
  height?: number; // 0-100
  color?: string;
}

export interface Seat {
  id: string;
  evento_id: string;
  seccion: string;
  fila: string;
  numero: string;
  precio: number;
  estado: 'available' | 'reserved' | 'sold';
  coordenadas?: { x: number; y: number }; // Made optional as some events might be general admission
  typeId?: string; // Link to TicketType if applicable
}

export interface Reservation {
  id: string;
  usuario_id: string;
  evento_id: string;
  asientos_ids: string[];
  expira_en: string;
  estado: 'active' | 'expired' | 'completed';
  total: number;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'user' | 'organizer' | 'admin';
  avatar?: string;
}
