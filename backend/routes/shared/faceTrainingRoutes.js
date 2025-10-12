import express from 'express';
import { listFaceTraining, getFaceTrainingByEmployee, upsertFaceTraining, updateFaceTrainingStatus } from '../../controllers/shared/faceTrainingController.js';

const router = express.Router();

// No auth middleware to allow edge device calls; add verifyUser if you want to protect
router.get('/', listFaceTraining);
router.get('/:employee_id', getFaceTrainingByEmployee);
router.post('/', upsertFaceTraining);
router.patch('/:employee_id/status', updateFaceTrainingStatus);

export default router;
