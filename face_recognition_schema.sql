-- Face Recognition Database Schema
-- This file contains SQL statements to create necessary tables for face recognition system

-- Table for storing face training data and models
CREATE TABLE IF NOT EXISTS `face_training` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(20) NOT NULL COMMENT 'Reference to users.user_id',
  `model_id` varchar(36) NOT NULL COMMENT 'UUID for the model',
  `training_images_count` int(11) NOT NULL DEFAULT 0,
  `model_path` varchar(255) NOT NULL COMMENT 'Path to the trained model file',
  `model_data` longblob COMMENT 'Binary model data if storing in database',
  `training_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accuracy_score` decimal(5,4) DEFAULT NULL COMMENT 'Model accuracy if available',
  `status` enum('active','inactive','training','failed') NOT NULL DEFAULT 'active',
  `notes` text COMMENT 'Additional notes about the training',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_model` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_training_date` (`training_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table for storing face attendance logs (separate from main attendance)
CREATE TABLE IF NOT EXISTS `face_attendance_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(20) NOT NULL COMMENT 'Reference to users.user_id',
  `recognition_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confidence_score` decimal(5,4) NOT NULL COMMENT 'Recognition confidence (0-1)',
  `face_image_path` varchar(255) DEFAULT NULL COMMENT 'Path to captured face image',
  `status` enum('recognized','failed','low_confidence') NOT NULL DEFAULT 'recognized',
  `session_id` int(11) DEFAULT NULL COMMENT 'Reference to attendance_sessions.id if applicable',
  `verification_method` varchar(50) DEFAULT 'face_recognition',
  `device_info` json DEFAULT NULL COMMENT 'Information about capturing device',
  `location_info` json DEFAULT NULL COMMENT 'Location information if available',
  `processing_time` decimal(8,3) DEFAULT NULL COMMENT 'Recognition processing time in seconds',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee_timestamp` (`employee_id`, `recognition_timestamp`),
  KEY `idx_status` (`status`),
  KEY `idx_confidence` (`confidence_score`),
  KEY `idx_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table for door access logs (already exists in backend but ensure it exists)
CREATE TABLE IF NOT EXISTS `door_access_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) DEFAULT NULL COMMENT 'Reference to users.user_id',
  `access_type` enum('face_recognition','keycard','manual_override','emergency') NOT NULL,
  `access_status` enum('granted','denied','forced') NOT NULL,
  `confidence_score` decimal(5,4) DEFAULT NULL COMMENT 'Face recognition confidence if applicable',
  `reason` varchar(200) DEFAULT NULL COMMENT 'Reason for denial or override',
  `accessed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_id` int(11) DEFAULT NULL COMMENT 'Reference to attendance_sessions.id if applicable',
  `device_info` json DEFAULT NULL COMMENT 'Information about access device',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP address of access attempt',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_access_status` (`access_status`),
  KEY `idx_accessed_at` (`accessed_at`),
  KEY `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table for storing face dataset images metadata
CREATE TABLE IF NOT EXISTS `face_dataset_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(20) NOT NULL COMMENT 'Reference to users.user_id',
  `image_path` varchar(255) NOT NULL COMMENT 'Path to the dataset image',
  `image_hash` varchar(64) DEFAULT NULL COMMENT 'SHA256 hash of image for duplicate detection',
  `capture_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_quality_score` decimal(5,4) DEFAULT NULL COMMENT 'Quality score if calculated',
  `face_coordinates` json DEFAULT NULL COMMENT 'Face bounding box coordinates',
  `image_size` json DEFAULT NULL COMMENT 'Width and height of image',
  `capture_device` varchar(100) DEFAULT NULL COMMENT 'Camera or device used',
  `is_used_in_training` tinyint(1) DEFAULT 1 COMMENT 'Whether image was used in model training',
  `status` enum('active','deleted','corrupted') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_capture_timestamp` (`capture_timestamp`),
  KEY `idx_status` (`status`),
  KEY `idx_image_hash` (`image_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add indexes for better performance
ALTER TABLE `face_training` ADD INDEX `idx_employee_status` (`employee_id`, `status`);
ALTER TABLE `face_attendance_log` ADD INDEX `idx_daily_attendance` (`employee_id`, `recognition_timestamp`);
ALTER TABLE `door_access_logs` ADD INDEX `idx_daily_access` (`user_id`, `accessed_at`);

-- Add foreign key constraints (optional, depends on your existing schema)
-- Uncomment these if you want to enforce referential integrity

-- ALTER TABLE `face_training` 
-- ADD CONSTRAINT `fk_face_training_user` 
-- FOREIGN KEY (`employee_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE `face_attendance_log` 
-- ADD CONSTRAINT `fk_face_attendance_user` 
-- FOREIGN KEY (`employee_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE `door_access_logs` 
-- ADD CONSTRAINT `fk_door_access_user` 
-- FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `face_dataset_images` 
-- ADD CONSTRAINT `fk_face_dataset_user` 
-- FOREIGN KEY (`employee_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;