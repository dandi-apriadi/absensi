import express from 'express';

const router = express.Router();

// ===============================================
// SINGLE ROOM SYSTEM - STATIC ROUTES
// ===============================================
// Since we only have 1 room, room management is simplified to static responses

// Get main room info
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: [{
            id: 1,
            room_code: 'MAIN',
            room_name: 'Main Classroom',
            building: 'Main Building',
            floor: 1,
            capacity: 40,
            room_type: 'classroom',
            facilities: ['projector', 'AC', 'whiteboard', 'face_recognition'],
            has_face_recognition: true,
            status: 'available'
        }]
    });
});

// Get main room by ID
router.get('/:id', (req, res) => {
    res.json({
        success: true,
        data: {
            id: 1,
            room_code: 'MAIN',
            room_name: 'Main Classroom',
            building: 'Main Building',
            floor: 1,
            capacity: 40,
            room_type: 'classroom',
            facilities: ['projector', 'AC', 'whiteboard', 'face_recognition'],
            has_face_recognition: true,
            status: 'available'
        }
    });
});

// Other room operations return not applicable for single room system
router.post('/', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'Room creation not available in single room system'
    });
});

router.put('/:id', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'Room modification not available in single room system'
    });
});

router.delete('/:id', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'Room deletion not available in single room system'
    });
});

export default router;
