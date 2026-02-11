import { Router } from 'express';
import { WaitingRoomController } from '../controllers/waiting-room.js';

const router = Router();

router.post('/join', WaitingRoomController.join);
router.get('/status', WaitingRoomController.status);

export default router;
