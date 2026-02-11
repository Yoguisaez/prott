import { Seat, Reservation } from '../types';
import { MOCK_SEATS, MOCK_EVENTS } from '../data/mock';

export const getSeats = async (eventId: string): Promise<{ success: boolean; data: Seat[] }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const seats = MOCK_SEATS[eventId] || [];
  return { success: true, data: seats };
};

export const reserveSeats = async (eventId: string, userId: string, seatIds: string[]): Promise<{ success: boolean; data: any }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  const seats = MOCK_SEATS[eventId]?.filter(s => seatIds.includes(s.id)) || [];

  // Mock reservation logic with populated data for the frontend
  const reservation = {
    id: Math.random().toString(36).substr(2, 9),
    usuario_id: userId,
    evento_id: eventId,
    asientos_ids: seatIds,
    expira_en: new Date(Date.now() + 15 * 60000).toISOString(), // 15 mins
    estado: 'active',
    total: seats.reduce((sum, s) => sum + s.precio, 0),
    // Populate details for Cart view
    events: event,
    seats_details: seats
  };
  
  return { success: true, data: reservation };
};
