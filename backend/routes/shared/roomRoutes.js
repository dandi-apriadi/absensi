import express from 'express';
import {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomSchedule,
    checkRoomAvailability,
    getRoomAccessHistory
} from '../../controllers/shared/roomController.js';

const router = express.Router();

// ===============================================
// ROOM MANAGEMENT ROUTES
// ===============================================

// Basic CRUD
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

// Schedule and availability
router.get('/:id/schedule', getRoomSchedule);
router.get('/:id/availability', checkRoomAvailability);

// Access history
router.get('/:id/access-history', getRoomAccessHistory);

export default router;
