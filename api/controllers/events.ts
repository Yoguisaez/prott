import { Request, Response } from 'express';
import { EventService } from '../services/events.js';

export class EventController {
  static async getEvents(req: Request, res: Response) {
    try {
      const { ciudad, categoria, fecha_desde, limit, page } = req.query;

      const result = await EventService.getAllEvents({
        ciudad: ciudad as string,
        categoria: categoria as string,
        fecha_desde: fecha_desde as string,
        limit: limit ? parseInt(limit as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
      });

      res.json({
        success: true,
        data: result.data,
        meta: {
          total: result.count,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found',
        });
      }

      res.json({
        success: true,
        data: event,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
