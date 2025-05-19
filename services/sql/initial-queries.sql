-- Auth Tables
CREATE TABLE IF NOT EXISTS `company_roles` (
  `company_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_role_name` varchar(255) NOT NULL,
  PRIMARY KEY (company_role_id),
  UNIQUE (company_role_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id), 
  UNIQUE (user_email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users_info` (
  `user_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_first_name` varchar(255) NOT NULL,
  `user_last_name` varchar(255) NOT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (user_info_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users_pass` (
  `user_pass_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_password_hashed` varchar(255) NOT NULL,
  PRIMARY KEY (user_pass_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users_role` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_role_id` int(11) NOT NULL,
  PRIMARY KEY (user_role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (company_role_id) REFERENCES company_roles(company_role_id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `password_reset_requests` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `token` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `otp_requests` (
  `otp_id` int AUTO_INCREMENT PRIMARY KEY,
  `token` varchar(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT, 
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `tags` (
    `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
    `tag_name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `services` (
    `service_id` INT AUTO_INCREMENT PRIMARY KEY,
    `service_name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Clients TABLE
CREATE TABLE IF NOT EXISTS `clients` (
  `client_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `logo_url` VARCHAR(500) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `client_role` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB;

-- blog Tables
CREATE TABLE IF NOT EXISTS `blogs` (
    `blog_id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` VARCHAR(355) UNIQUE NOT NULL,
    `author_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('Draft', 'Published', 'archived') NOT NULL DEFAULT 'Draft',
    `image_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `blog_categories` (
    `blog_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`blog_id`, `category_id`),
    FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`blog_id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create Blog Tags Table
CREATE TABLE IF NOT EXISTS `blog_tags` (
    `blog_id` INT NOT NULL,
    `tag_id` INT NOT NdULL,
    PRIMARY KEY (`blog_id`, `tag_id`),
    FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`blog_id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `quotes` (
    `quote_id` INT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(100),
    `last_name` VARCHAR(100),
    `email` VARCHAR(150),
    `phone_number` VARCHAR(50),
    `origin_address` TEXT,
    `destination_address` TEXT,
    `city` TEXT,
    `address` TEXT,
    `additional_info` TEXT,
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `cargos` (
    `cargo_id` INT AUTO_INCREMENT PRIMARY KEY,
    `quote_id` INT,
    `weight_kg` DECIMAL(10,2),
    `dimensions` VARCHAR(100),
    `number_of_pieces` INT,
    `commodity` TEXT,
    FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`quote_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `quote_services` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `quote_id` INT,
    `service_id` INT,
    FOREIGN KEY (quote_id) REFERENCES `quotes`(quote_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES `services`(service_id) ON DELETE CASCADE
);
-- INSERT INTO `services` (service_name) VALUES
-- ('Ocean Freight'),
-- ('Air Freight'),
-- ('Customs Clearance'),
-- ('Warehousing'),
-- ('Documentation Services'),
-- ('Human Network Air Cargo');