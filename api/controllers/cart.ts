import { Request, Response } from 'express';
import { CartService } from '../services/cart.js';

export class CartController {
  static async getCart(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cart = await CartService.getReservationById(id);
      res.json({ success: true, data: cart });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async cancelCart(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CartService.cancelReservation(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
