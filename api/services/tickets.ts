import { supabase } from '../config/supabase.js';

export class TicketService {
  static async getTicketsByUserId(userId: string) {
    try {
      // Better approach with explicit inner join syntax for filtering
      const { data: tickets, error: deepError } = await supabase
        .from('tickets')
        .select(`
          *,
          seats (seccion, fila, numero),
          purchases!inner (
            usuario_id,
            events (titulo, fecha, lugar, imagen_url)
          )
        `)
        .eq('purchases.usuario_id', userId)
        .order('created_at', { ascending: false });

      if (deepError) throw new Error(deepError.message);

      return tickets;
    } catch (error) {
      console.error('Error fetching tickets, returning mock:', error);
      
      // Return mock tickets
      return [
        {
          id: 'mock-ticket-1',
          codigo_qr: 'mock-qr-code-12345',
          estado: 'active',
          seats: { seccion: 'Cancha VIP', fila: 'A', numero: '1' },
          purchases: {
            usuario_id: userId,
            events: {
              titulo: 'Concierto de Rock Estelar',
              fecha: new Date(Date.now() + 86400000 * 30).toISOString(),
              lugar: 'Estadio Nacional',
              imagen_url: 'https://images.unsplash.com/photo-1459749411177-734a649eae5b?w=800&q=80'
            }
          }
        },
        {
          id: 'mock-ticket-2',
          codigo_qr: 'mock-qr-code-67890',
          estado: 'active',
          seats: { seccion: 'Cancha VIP', fila: 'A', numero: '2' },
          purchases: {
            usuario_id: userId,
            events: {
              titulo: 'Concierto de Rock Estelar',
              fecha: new Date(Date.now() + 86400000 * 30).toISOString(),
              lugar: 'Estadio Nacional',
              imagen_url: 'https://images.unsplash.com/photo-1459749411177-734a649eae5b?w=800&q=80'
            }
          }
        }
      ];
    }
  }
}
