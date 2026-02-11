import { Router } from 'express';
import { SeatController } from '../controllers/seats.js';

const router = Router();

router.get('/:eventId', SeatController.getSeats);
router.post('/reserve', SeatController.reserve);

export default router;
