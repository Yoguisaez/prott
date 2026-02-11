import { Event, Seat } from '../types';
import { MOCK_EVENTS, MOCK_SEATS, generateSeats } from '../data/mock';

export const getEvents = async (filters?: { ciudad?: string; categoria?: string; fecha_desde?: string; busqueda?: string }): Promise<{ success: boolean; data: Event[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...MOCK_EVENTS];
  
  if (filters?.ciudad) {
    filtered = filtered.filter(e => e.ciudad.toLowerCase().includes(filters.ciudad!.toLowerCase()));
  }
  
  if (filters?.categoria) {
    filtered = filtered.filter(e => e.categorias.some(c => c.toLowerCase() === filters.categoria!.toLowerCase()));
  }

  if (filters?.busqueda) {
    const term = filters.busqueda.toLowerCase();
    filtered = filtered.filter(e => 
      e.titulo.toLowerCase().includes(term) ||
      e.descripcion.toLowerCase().includes(term) ||
      e.lugar.toLowerCase().includes(term) ||
      e.ciudad.toLowerCase().includes(term)
    );
  }

  return { success: true, data: filtered };
};

export const getEventById = async (id: string): Promise<{ success: boolean; data: Event }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const event = MOCK_EVENTS.find(e => e.id === id);
  
  if (!event) {
    throw new Error('Evento no encontrado');
  }
  
  return { success: true, data: event };
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'activo' | 'sold'>): Promise<{ success: boolean; data: Event }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newEventId = Math.random().toString(36).substr(2, 9);
  
  const newEvent: Event = {
    ...eventData,
    id: newEventId,
    activo: true,
    ticketTypes: eventData.ticketTypes || [],
    sections: eventData.sections || []
  };
  
  // Generar asientos para sectores numerados
  if (eventData.sections) {
    const eventSeats: Seat[] = [];
    
    eventData.sections.forEach(section => {
      if (section.type === 'assigned' && section.rows && section.seatsPerRow) {
        const seats = generateSeats(
          newEventId,
          section.name,
          section.rows,
          section.seatsPerRow,
          section.price
        );
        eventSeats.push(...seats);
      }
    });
    
    if (eventSeats.length > 0) {
      MOCK_SEATS[newEventId] = eventSeats;
    }
  }
  
  MOCK_EVENTS.push(newEvent);
  
  return { success: true, data: newEvent };
};
