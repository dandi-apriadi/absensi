# Backend API Error 500 - Face Training Endpoint

## Error yang Terjadi

```
[TRAINING] POST https://siabsensi.site/api/face-training
[TRAINING] Response status: 500
[TRAINING] ✗ Backend returned 500: {"success":false,"message":"Gagal menyimpan data face_training"}
```

## Penyebab Error 500

Error 500 (Internal Server Error) pada endpoint `/api/face-training` kemungkinan disebabkan oleh:

1. **Database constraint violation** - Missing required field, foreign key constraint
2. **Model definition issue** - Field tidak match dengan payload
3. **Sequelize/ORM error** - Syntax error di model atau query
4. **Missing middleware** - Authentication atau validation error

## Cara Debug di Backend

### 1. Check Backend Logs

Di server backend Node.js:
```bash
# Check console/terminal logs
pm2 logs absensi-backend

# Or check log files
tail -f logs/error.log
tail -f logs/combined.log
```

Cari error stack trace seperti:
```
SequelizeValidationError: notNull Violation: face_training.employee_id cannot be null
SequelizeForeignKeyConstraintError: insert or update violates foreign key constraint
```

### 2. Verify Database Schema

Check apakah tabel `face_training` sudah exist dan struktur fieldnya:

```sql
-- Check table structure
DESCRIBE face_training;

-- Expected structure (adjust to match your schema):
-- employee_id VARCHAR(50) NOT NULL
-- model_id VARCHAR(50) NOT NULL  
-- training_images_count INT
-- model_path VARCHAR(255)
-- status ENUM('active', 'inactive')
-- created_at DATETIME
-- updated_at DATETIME
```

### 3. Test Endpoint Manually

```bash
# Get session cookie first (login)
curl -X POST https://siabsensi.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -c cookies.txt

# Test face-training endpoint
curl -X POST https://siabsensi.site/api/face-training \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "employee_id": "student001",
    "model_id": "test-uuid-123",
    "training_images_count": 100,
    "model_path": "models/employee_student001_model.yml",
    "status": "active"
  }' \
  -v
```

## Implementasi Backend Endpoint yang Benar

### Option A: Using Sequelize (Recommended)

**File: `backend/models/faceTrainingModel.js`**

```javascript
module.exports = (sequelize, DataTypes) => {
  const FaceTraining = sequelize.define('FaceTraining', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,  // One model per employee
      references: {
        model: 'users',  // FK to users table
        key: 'user_id'
      }
    },
    model_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    training_images_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    model_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'face_training',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return FaceTraining;
};
```

**File: `backend/routes/shared/faceTrainingRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const { FaceTraining, User } = require('../../models');
const { Op } = require('sequelize');

// POST /api/face-training - Upsert face training model
router.post('/', async (req, res) => {
    try {
        const { employee_id, model_id, training_images_count, model_path, status } = req.body;

        // Validation
        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: 'employee_id is required'
            });
        }

        if (!model_id) {
            return res.status(400).json({
                success: false,
                message: 'model_id is required'
            });
        }

        // Check if user exists
        const user = await User.findOne({ where: { user_id: employee_id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with employee_id ${employee_id} not found`
            });
        }

        // Upsert (create or update based on employee_id)
        const [training, created] = await FaceTraining.upsert({
            employee_id,
            model_id,
            training_images_count: training_images_count || 0,
            model_path: model_path || '',
            status: status || 'active'
        }, {
            returning: true
        });

        res.status(created ? 201 : 200).json({
            success: true,
            message: created ? 
                'Model wajah berhasil disimpan' : 
                'Model wajah berhasil diupdate',
            data: training
        });

    } catch (error) {
        console.error('Error in face training upsert:', error);
        
        // Specific error handling
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error: ' + error.message,
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Employee ID tidak valid atau tidak ditemukan'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan data face_training',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/face-training - Get all active models
router.get('/', async (req, res) => {
    try {
        const { status = 'active' } = req.query;

        const trainings = await FaceTraining.findAll({
            where: { status },
            include: [{
                model: User,
                attributes: ['user_id', 'fullname', 'email', 'role']
            }],
            order: [['updated_at', 'DESC']]
        });

        res.json({
            success: true,
            data: trainings
        });

    } catch (error) {
        console.error('Error fetching face trainings:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data face training'
        });
    }
});

// GET /api/face-training/:employee_id - Get model by employee_id
router.get('/:employee_id', async (req, res) => {
    try {
        const { employee_id } = req.params;

        const training = await FaceTraining.findOne({
            where: { employee_id },
            include: [{
                model: User,
                attributes: ['user_id', 'fullname', 'email', 'role']
            }]
        });

        if (!training) {
            return res.status(404).json({
                success: false,
                message: 'Model tidak ditemukan untuk employee ini'
            });
        }

        res.json({
            success: true,
            data: training
        });

    } catch (error) {
        console.error('Error fetching face training:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data face training'
        });
    }
});

// PATCH /api/face-training/:employee_id/status - Update status only
router.patch('/:employee_id/status', async (req, res) => {
    try {
        const { employee_id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status harus active atau inactive'
            });
        }

        const [updated] = await FaceTraining.update(
            { status },
            { where: { employee_id } }
        );

        if (updated === 0) {
            return res.status(404).json({
                success: false,
                message: 'Model tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Status model berhasil diupdate'
        });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal update status'
        });
    }
});

module.exports = router;
```

**Register route di `backend/routes/routes-backend.js`:**

```javascript
const faceTrainingRoutes = require('./shared/faceTrainingRoutes');

// Add after other route registrations
app.use('/api/face-training', AuthUser.authenticate, faceTrainingRoutes);
```

### Option B: Using Raw MySQL (If not using ORM)

**File: `backend/controllers/shared/faceTrainingController.js`**

```javascript
const db = require('../../config/Database');

const faceTrainingController = {
    // Upsert face training
    async upsert(req, res) {
        try {
            const { employee_id, model_id, training_images_count, model_path, status } = req.body;

            // Validation
            if (!employee_id || !model_id) {
                return res.status(400).json({
                    success: false,
                    message: 'employee_id and model_id are required'
                });
            }

            const query = `
                INSERT INTO face_training 
                (employee_id, model_id, training_images_count, model_path, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                    model_id = VALUES(model_id),
                    training_images_count = VALUES(training_images_count),
                    model_path = VALUES(model_path),
                    status = VALUES(status),
                    updated_at = NOW()
            `;

            const values = [
                employee_id,
                model_id,
                training_images_count || 0,
                model_path || '',
                status || 'active'
            ];

            const [result] = await db.query(query, values);

            res.status(result.affectedRows ? 201 : 200).json({
                success: true,
                message: 'Model wajah berhasil disimpan',
                data: {
                    employee_id,
                    model_id,
                    training_images_count,
                    model_path,
                    status
                }
            });

        } catch (error) {
            console.error('Error in face training upsert:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal menyimpan data face_training',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get all trainings
    async getAll(req, res) {
        try {
            const { status = 'active' } = req.query;

            const query = `
                SELECT ft.*, u.fullname, u.email, u.role
                FROM face_training ft
                JOIN users u ON ft.employee_id = u.user_id
                WHERE ft.status = ?
                ORDER BY ft.updated_at DESC
            `;

            const [rows] = await db.query(query, [status]);

            res.json({
                success: true,
                data: rows
            });

        } catch (error) {
            console.error('Error fetching face trainings:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil data face training'
            });
        }
    },

    // Get by employee_id
    async getByEmployeeId(req, res) {
        try {
            const { employee_id } = req.params;

            const query = `
                SELECT ft.*, u.fullname, u.email, u.role
                FROM face_training ft
                JOIN users u ON ft.employee_id = u.user_id
                WHERE ft.employee_id = ?
            `;

            const [rows] = await db.query(query, [employee_id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Model tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: rows[0]
            });

        } catch (error) {
            console.error('Error fetching face training:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil data face training'
            });
        }
    }
};

module.exports = faceTrainingController;
```

## Testing Checklist

- [ ] Tabel `face_training` exist di database
- [ ] Foreign key `employee_id` valid (referensi ke `users.user_id`)
- [ ] Route terdaftar di backend
- [ ] Middleware `AuthUser.authenticate` berfungsi
- [ ] Test dengan curl return 200/201 (bukan 500)
- [ ] Data tersimpan di database
- [ ] Face recognition tetap jalan (model file local ada)

## Workaround Sementara

Jika backend belum siap, sistem sekarang **sudah auto fallback ke database lokal**:

1. Coba POST ke backend
2. Jika backend error/unavailable → otomatis save ke DB lokal
3. Face recognition tetap jalan karena model file `.yml` sudah ada

Jadi user tidak akan melihat error lagi, hanya warning bahwa registrasi backend gagal tapi model tetap berfungsi.
