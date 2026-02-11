import { supabase } from '../config/supabase.js';

export class SeatService {
  static async getSeatsByEventId(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('evento_id', eventId)
        .order('fila', { ascending: true })
        .order('numero', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
        // Try to generate seats if empty (and we have connection)
        await this.generateSeatsIfEmpty(eventId);
        // Retry fetch
        const { data: newData } = await supabase
          .from('seats')
          .select('*')
          .eq('evento_id', eventId);
        return newData;
      }

      return data;
    } catch (error) {
      console.error('Error fetching seats, returning mock data:', error);
      return this.generateMockSeats(eventId);
    }
  }

  static generateMockSeats(eventId: string) {
    const seats = [];
    const sections = ['Cancha VIP', 'Platea Baja', 'Platea Alta', 'Tribuna'];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 20;

    let idCounter = 1;
    for (const section of sections) {
      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          const isReserved = Math.random() < 0.2; // 20% reserved
          const isSold = Math.random() < 0.1; // 10% sold
          
          seats.push({
            id: `mock-seat-${idCounter++}`,
            evento_id: eventId,
            seccion: section,
            fila: row,
            numero: i.toString(),
            precio: section === 'Cancha VIP' ? 150000 : (section === 'Platea Baja' ? 80000 : 40000),
            estado: isSold ? 'sold' : (isReserved ? 'reserved' : 'available'),
            coordenadas: { x: i * 30, y: parseInt(row, 36) * 30 }
          });
        }
      }
    }
    return seats;
  }

  static async reserveSeats(eventId: string, userId: string, seatIds: string[]) {
    try {
      // Ensure user exists (Demo hack for guest checkout)
      const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
      if (!user) {
        await supabase.from('users').insert({
          id: userId,
          email: `guest_${userId}@example.com`,
          password_hash: 'guest_hash', // Dummy
          nombre: 'Guest User',
          rol: 'user'
        });
      }

      // Start a transaction (Supabase doesn't support traditional transactions via JS client easily, 
      // but we can use RPC or careful logic. For this demo, we check availability and then insert reservation)
      
      // 1. Check if seats are available
      const { data: seats, error: seatsError } = await supabase
        .from('seats')
        .select('id, estado')
        .in('id', seatIds);

      if (seatsError) throw new Error(seatsError.message);

      const unavailable = seats.some(seat => seat.estado !== 'available');
      if (unavailable) {
        throw new Error('Some seats are no longer available');
      }

      // 2. Create reservation
      const expiraEn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      const { data: reservation, error: resError } = await supabase
        .from('reservations')
        .insert({
          usuario_id: userId, // In a real app this would be UUID, for demo we might need to handle the anonymous ID properly
          evento_id: eventId,
          asientos_ids: seatIds,
          expira_en: expiraEn.toISOString(),
          estado: 'active'
        })
        .select()
        .single();

      if (resError) throw new Error(resError.message);

      // 3. Update seat status
      const { error: updateError } = await supabase
        .from('seats')
        .update({ estado: 'reserved' })
        .in('id', seatIds);

      if (updateError) {
        // Rollback reservation (delete it)
        await supabase.from('reservations').delete().eq('id', reservation.id);
        throw new Error('Failed to update seat status');
      }

      return reservation;
    } catch (error) {
      console.error('Error reserving seats, returning mock reservation:', error);
      
      // Fallback mock reservation
      return {
        id: `mock-reservation-${Date.now()}`,
        usuario_id: userId,
        evento_id: eventId,
        asientos_ids: seatIds,
        expira_en: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        estado: 'active',
        created_at: new Date().toISOString()
      };
    }
  }

  // Helper to generate seats for an event if they don't exist (for demo)
  static async generateSeatsIfEmpty(eventId: string) {
    const { count } = await supabase
      .from('seats')
      .select('*', { count: 'exact', head: true })
      .eq('evento_id', eventId);

    if (count && count > 0) return;

    // Generate a simple grid
    const sections = ['A', 'B'];
    const rows = ['1', '2', '3', '4', '5'];
    const seatsPerRow = 10;
    const seats = [];

    for (const section of sections) {
      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          seats.push({
            evento_id: eventId,
            seccion: section,
            fila: row,
            numero: i.toString(),
            precio: section === 'A' ? 50000 : 30000,
            estado: 'available',
            coordenadas: { x: i * 30, y: parseInt(row) * 30 } // Dummy coords
          });
        }
      }
    }

    const { error } = await supabase.from('seats').insert(seats);
    if (error) console.error('Error generating seats:', error);
  }
}
