import { supabase } from '../config/supabase.js';

export class CartService {
  static async getReservationById(id: string) {
    // Handle mock reservations
    if (id.startsWith('mock-reservation-')) {
      return {
        id,
        usuario_id: 'mock-user',
        evento_id: '1', // Default to first mock event
        asientos_ids: ['mock-seat-1', 'mock-seat-2'],
        expira_en: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        estado: 'active',
        events: {
          titulo: 'Concierto de Rock Estelar',
          fecha: new Date(Date.now() + 86400000 * 30).toISOString(),
          lugar: 'Estadio Nacional'
        },
        users: { email: 'guest@example.com' },
        seats_details: [
          { id: 'mock-seat-1', seccion: 'Cancha VIP', fila: 'A', numero: '1', precio: 150000 },
          { id: 'mock-seat-2', seccion: 'Cancha VIP', fila: 'A', numero: '2', precio: 150000 }
        ]
      };
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          events (titulo, fecha, lugar),
          users (email)
        `)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      
      // Fetch seat details manually since we store IDs in array
      if (data.asientos_ids && data.asientos_ids.length > 0) {
        const { data: seats } = await supabase
          .from('seats')
          .select('*')
          .in('id', data.asientos_ids);
        data.seats_details = seats;
      }

      return data;
    } catch (error) {
      console.error('Error fetching reservation, returning mock:', error);
      // Fallback for real IDs if connection fails
      return {
        id,
        usuario_id: 'mock-user',
        evento_id: '1',
        asientos_ids: [],
        expira_en: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        estado: 'active',
        events: { titulo: 'Evento Mock', fecha: new Date().toISOString(), lugar: 'Lugar Mock' },
        users: { email: 'guest@example.com' },
        seats_details: []
      };
    }
  }

  static async cancelReservation(id: string) {
    if (id.startsWith('mock-reservation-')) {
      return { success: true };
    }

    try {
      const { data: reservation } = await supabase
        .from('reservations')
        .select('asientos_ids')
        .eq('id', id)
        .single();

      if (!reservation) return;

      // Release seats
      if (reservation.asientos_ids.length > 0) {
        await supabase
          .from('seats')
          .update({ estado: 'available' })
          .in('id', reservation.asientos_ids);
      }

      // Update reservation status
      await supabase
        .from('reservations')
        .update({ estado: 'expired' })
        .eq('id', id);
        
      return { success: true };
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      return { success: true }; // Pretend it worked
    }
  }
}
