import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.js';

const router = Router();

router.post('/process', CheckoutController.process);

export default router;
