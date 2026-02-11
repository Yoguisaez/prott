import { Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.js';

export class CheckoutController {
  static async process(req: Request, res: Response) {
    try {
      const { reservationId, paymentDetails } = req.body;
      if (!reservationId || !paymentDetails) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const result = await CheckoutService.processPayment(reservationId, paymentDetails);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
