import { MOCK_EVENTS, MOCK_SEATS } from '../data/mock';

export const getReservation = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a generic mock reservation if needed, 
  // though usually the flow passes state from SeatSelection
  const event = MOCK_EVENTS[0];
  const seats = MOCK_SEATS['1'].slice(0, 2);

  return {
    success: true,
    data: {
      id: id,
      usuario_id: '1',
      evento_id: event.id,
      asientos_ids: seats.map(s => s.id),
      expira_en: new Date(Date.now() + 15 * 60000).toISOString(),
      estado: 'active',
      total: seats.reduce((sum, s) => sum + s.precio, 0),
      events: event,
      seats_details: seats
    }
  };
};

export const cancelReservation = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true, message: 'Reserva cancelada' };
};
