import { MOCK_EVENTS, MOCK_SEATS } from '../data/mock';

export const getMyTickets = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 600));

  // Generate some mock tickets for the user
  const event1 = MOCK_EVENTS[0];
  const seat1 = MOCK_SEATS['1'][0];
  
  const tickets = [
    {
      id: 'ticket-1',
      codigo_qr: 'valid-ticket-123',
      purchases: {
        events: event1
      },
      seats: seat1
    },
    {
      id: 'ticket-2',
      codigo_qr: 'valid-ticket-456',
      purchases: {
        events: event1
      },
      seats: MOCK_SEATS['1'][1]
    }
  ];

  return { success: true, data: tickets };
};
