import { Router } from 'express';
import { CartController } from '../controllers/cart.js';

const router = Router();

router.get('/:id', CartController.getCart);
router.post('/:id/cancel', CartController.cancelCart);

export default router;
