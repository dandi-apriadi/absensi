import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// ===============================================
// UNIFIED USERS TABLE - Tabel Pengguna Terpadu
// ===============================================
const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        comment: 'NIM untuk student, NIP untuk lecturer, Admin ID untuk super-admin'
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'lecturer', 'super-admin'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Path to profile image'
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // ===============================================
    // STUDENT SPECIFIC FIELDS
    // ===============================================
    program_study: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Only for students - Program studi'
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Only for students - Semester saat ini'
    },
    academic_year: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Only for students - Format: 2024/2025'
    },
    entrance_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Only for students - Tahun masuk'
    },
    gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Only for students - Grade Point Average'
    },
    guardian_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Only for students - Nama wali'
    },
    guardian_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        comment: 'Only for students - No telepon wali'
    },

    // ===============================================
    // LECTURER SPECIFIC FIELDS
    // ===============================================
    department: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'For lecturers and admins - Departemen/Fakultas'
    },
    position: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Only for lecturers - Jabatan (Dosen, Asisten Dosen, etc.)'
    },
    specialization: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Only for lecturers - Bidang keahlian/spesialisasi'
    },
    education_level: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Only for lecturers - Tingkat pendidikan (S1, S2, S3, Prof.)'
    },
    office_room: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Only for lecturers - Ruang kantor'
    },
    employee_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Only for lecturers - NIP (Nomor Induk Pegawai)'
    },

    // ===============================================
    // SUPER ADMIN SPECIFIC FIELDS
    // ===============================================
    admin_level: {
        type: DataTypes.ENUM('system_admin', 'faculty_admin', 'it_admin'),
        allowNull: true,
        comment: 'Only for super-admin - Level administrator'
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Only for super-admin - Array of specific permissions'
    },
    department_access: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Only for super-admin - Array of accessible departments'
    },

    // ===============================================
    // ADDITIONAL COMMON FIELDS
    // ===============================================
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Tanggal lahir'
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true,
        comment: 'Jenis kelamin'
    },
    emergency_contact: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Kontak darurat'
    },
    emergency_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        comment: 'No telepon kontak darurat'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Catatan tambahan'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['email']
        },
        {
            fields: ['role', 'status']
        },
        {
            fields: ['department']
        },
        {
            fields: ['program_study']
        },
        {
            fields: ['employee_id']
        }
    ],
    // Validation untuk memastikan field yang sesuai role terisi
    validate: {
        // Validasi untuk student
        studentFieldsRequired() {
            if (this.role === 'student') {
                if (!this.program_study) {
                    throw new Error('Program study is required for students');
                }
                if (!this.semester) {
                    throw new Error('Semester is required for students');
                }
                if (!this.entrance_year) {
                    throw new Error('Entrance year is required for students');
                }
            }
        },
        // Validasi untuk lecturer
        lecturerFieldsRequired() {
            if (this.role === 'lecturer') {
                if (!this.department) {
                    throw new Error('Department is required for lecturers');
                }
                if (!this.position) {
                    throw new Error('Position is required for lecturers');
                }
                if (!this.employee_id) {
                    throw new Error('Employee ID (NIP) is required for lecturers');
                }
            }
        },
        // Validasi untuk super-admin
        adminFieldsRequired() {
            if (this.role === 'super-admin') {
                if (!this.admin_level) {
                    throw new Error('Admin level is required for super admins');
                }
            }
        }
    }
});

// ===============================================
// VIRTUAL FIELDS DAN METHODS
// ===============================================

// Virtual field untuk mendapatkan nama tampilan berdasarkan role
Users.prototype.getDisplayName = function () {
    switch (this.role) {
        case 'student':
            return `${this.full_name} (${this.user_id})`;
        case 'lecturer':
            return `${this.full_name}, ${this.education_level || ''}`;
        case 'super-admin':
            return `${this.full_name} (${this.admin_level || 'Admin'})`;
        default:
            return this.full_name;
    }
};

// Method untuk mendapatkan informasi role-specific
Users.prototype.getRoleSpecificData = function () {
    const baseData = {
        id: this.id,
        user_id: this.user_id,
        email: this.email,
        full_name: this.full_name,
        role: this.role,
        status: this.status,
        phone: this.phone,
        address: this.address,
        profile_picture: this.profile_picture,
        birth_date: this.birth_date,
        gender: this.gender,
        emergency_contact: this.emergency_contact,
        emergency_phone: this.emergency_phone,
        notes: this.notes,
        last_login: this.last_login,
        created_at: this.created_at,
        updated_at: this.updated_at
    };

    switch (this.role) {
        case 'student':
            return {
                ...baseData,
                student_data: {
                    program_study: this.program_study,
                    semester: this.semester,
                    academic_year: this.academic_year,
                    entrance_year: this.entrance_year,
                    gpa: this.gpa,
                    guardian_name: this.guardian_name,
                    guardian_phone: this.guardian_phone
                }
            };

        case 'lecturer':
            return {
                ...baseData,
                lecturer_data: {
                    department: this.department,
                    position: this.position,
                    specialization: this.specialization,
                    education_level: this.education_level,
                    office_room: this.office_room,
                    employee_id: this.employee_id
                }
            };

        case 'super-admin':
            return {
                ...baseData,
                admin_data: {
                    admin_level: this.admin_level,
                    permissions: this.permissions,
                    department_access: this.department_access,
                    department: this.department
                }
            };

        default:
            return baseData;
    }
};

// Method untuk update role-specific fields
Users.prototype.updateRoleSpecificData = function (data) {
    switch (this.role) {
        case 'student':
            this.program_study = data.program_study || this.program_study;
            this.semester = data.semester || this.semester;
            this.academic_year = data.academic_year || this.academic_year;
            this.entrance_year = data.entrance_year || this.entrance_year;
            this.gpa = data.gpa || this.gpa;
            this.guardian_name = data.guardian_name || this.guardian_name;
            this.guardian_phone = data.guardian_phone || this.guardian_phone;
            break;

        case 'lecturer':
            this.department = data.department || this.department;
            this.position = data.position || this.position;
            this.specialization = data.specialization || this.specialization;
            this.education_level = data.education_level || this.education_level;
            this.office_room = data.office_room || this.office_room;
            this.employee_id = data.employee_id || this.employee_id;
            break;

        case 'super-admin':
            this.admin_level = data.admin_level || this.admin_level;
            this.permissions = data.permissions || this.permissions;
            this.department_access = data.department_access || this.department_access;
            this.department = data.department || this.department;
            break;
    }
};

export { Users };
