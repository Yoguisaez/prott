import { Request, Response } from 'express';
import { WaitingRoomService } from '../services/waiting-room.js';

export class WaitingRoomController {
  static async join(req: Request, res: Response) {
    try {
      const { eventId, userId } = req.body;
      if (!eventId || !userId) {
        return res.status(400).json({ success: false, error: 'eventId and userId are required' });
      }

      const result = WaitingRoomService.joinQueue(eventId, userId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async status(req: Request, res: Response) {
    try {
      const { eventId, userId } = req.query;
      if (!eventId || !userId) {
        return res.status(400).json({ success: false, error: 'eventId and userId are required' });
      }

      const result = WaitingRoomService.getStatus(eventId as string, userId as string);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
