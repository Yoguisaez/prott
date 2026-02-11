import { Request, Response } from 'express';
import { TicketService } from '../services/tickets.js';

export class TicketController {
  static async getMyTickets(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }

      const tickets = await TicketService.getTicketsByUserId(userId as string);
      res.json({ success: true, data: tickets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
