import { Request, Response } from 'express';
import { SeatService } from '../services/seats.js';

export class SeatController {
  static async getSeats(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      
      // Auto-generate seats for demo if empty
      await SeatService.generateSeatsIfEmpty(eventId);

      const seats = await SeatService.getSeatsByEventId(eventId);
      res.json({ success: true, data: seats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async reserve(req: Request, res: Response) {
    try {
      const { eventId, userId, seatIds } = req.body;
      
      if (!eventId || !userId || !seatIds || seatIds.length === 0) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      // Since our users table expects a UUID but our demo frontend generates a random UUID which might not be in the users table,
      // we might run into FK constraint issues if we enforce FK on reservations.usuario_id.
      // For this "One Shot" demo without full auth flow, we might need to create a guest user or relax the constraint.
      // Or better, we ensure the frontend generated UUID is actually registered as an anonymous user if possible, 
      // but simpler is to handle it here: check if user exists, if not create a temporary one.
      // However, `users` table has email/password requirements.
      // Let's assume for this demo we skip the FK constraint check in the service or we insert a dummy user.
      // Actually, the best way is to modify the service to create a dummy user if not exists.
      
      // But wait, my schema defines `usuario_id UUID REFERENCES users(id)`. 
      // So I MUST have a valid user ID.
      // I will fix this in the service or just create a user on the fly here.
      
      const reservation = await SeatService.reserveSeats(eventId, userId, seatIds);
      res.json({ success: true, data: reservation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
