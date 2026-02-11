import { Router } from 'express';
import { TicketController } from '../controllers/tickets.js';

const router = Router();

router.get('/', TicketController.getMyTickets);

export default router;
