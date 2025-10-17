import { db } from "../../models/index.js";

// List face training records (optionally filter by status or employee_id)
export const listFaceTraining = async (req, res) => {
  try {
    const { status, employee_id } = req.query;
    let where = "WHERE 1=1";
    const replacements = {};
    if (status) {
      where += " AND ft.status = :status";
      replacements.status = status;
    }
    if (employee_id) {
      where += " AND ft.employee_id = :employee_id";
      replacements.employee_id = employee_id;
    }

    const rows = await db.query(
      `SELECT ft.employee_id, ft.model_id, ft.training_images_count, ft.model_path, ft.status, ft.created_at, ft.updated_at,
              u.fullname
       FROM face_training ft
       LEFT JOIN users u ON
           CONVERT(u.user_id USING utf8mb4) COLLATE utf8mb4_general_ci =
           CONVERT(ft.employee_id USING utf8mb4) COLLATE utf8mb4_general_ci
       ${where}
       ORDER BY ft.created_at DESC`,
      { replacements, type: db.QueryTypes.SELECT }
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('listFaceTraining error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data face_training' });
  }
};

// Get face training by employee id
export const getFaceTrainingByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const rows = await db.query(
      `SELECT ft.employee_id, ft.model_id, ft.training_images_count, ft.model_path, ft.status, ft.created_at, ft.updated_at,
              u.fullname
       FROM face_training ft
       LEFT JOIN users u ON
           CONVERT(u.user_id USING utf8mb4) COLLATE utf8mb4_general_ci =
           CONVERT(ft.employee_id USING utf8mb4) COLLATE utf8mb4_general_ci
       WHERE ft.employee_id = :employee_id
       ORDER BY ft.created_at DESC
       LIMIT 1`,
      { replacements: { employee_id }, type: db.QueryTypes.SELECT }
    );
    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('getFaceTrainingByEmployee error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data' });
  }
};

// Upsert face training record
export const upsertFaceTraining = async (req, res) => {
  try {
    const { employee_id, model_id, training_images_count, model_path, status = 'active' } = req.body;
    if (!employee_id || !model_id || !model_path) {
      return res.status(400).json({ success: false, message: 'employee_id, model_id, model_path wajib diisi' });
    }
    const now = new Date();
    await db.query(
      `INSERT INTO face_training (employee_id, model_id, training_images_count, model_path, status, created_at, updated_at)
       VALUES (:employee_id, :model_id, :training_images_count, :model_path, :status, :created_at, :updated_at)
       ON DUPLICATE KEY UPDATE
         model_id = VALUES(model_id),
         training_images_count = VALUES(training_images_count),
         model_path = VALUES(model_path),
         status = VALUES(status),
         updated_at = VALUES(updated_at)`,
      {
        replacements: {
          employee_id,
          model_id,
          training_images_count: training_images_count ?? null,
          model_path,
          status,
          created_at: now,
          updated_at: now
        }
      }
    );
    return res.status(200).json({ success: true, message: 'Face training upsert berhasil' });
  } catch (error) {
    console.error('upsertFaceTraining error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan data face_training' });
  }
};

// Update status (active/inactive)
export const updateFaceTrainingStatus = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { status } = req.body;
    if (!employee_id || !status) return res.status(400).json({ success: false, message: 'employee_id dan status wajib diisi' });
    await db.query(
      `UPDATE face_training SET status = :status, updated_at = :updated_at WHERE employee_id = :employee_id`,
      { replacements: { employee_id, status, updated_at: new Date() } }
    );
    return res.status(200).json({ success: true, message: 'Status face_training diperbarui' });
  } catch (error) {
    console.error('updateFaceTrainingStatus error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status' });
  }
};

export default {
  listFaceTraining,
  getFaceTrainingByEmployee,
  upsertFaceTraining,
  updateFaceTrainingStatus
};
