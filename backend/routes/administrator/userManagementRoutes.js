import express from "express";
import {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	updateUserStatus,
	bulkUpdateStatus,
	getDashboard
} from "../../controllers/administrator/userManagementController.js";

const router = express.Router();

// Dashboard stats for super-admin
router.get('/dashboard', getDashboard);

// Users CRUD
router.get('/users', getAllUsers);              // list with pagination & filters
router.get('/users/:id', getUserById);          // detail
router.post('/users', createUser);              // create
router.put('/users/:id', updateUser);           // update
router.delete('/users/:id', deleteUser);        // delete

// Status operations
router.patch('/users/:id/status', updateUserStatus);      // update status single
router.patch('/users/status/bulk', bulkUpdateStatus);     // bulk update status

export default router;