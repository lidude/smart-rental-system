CREATE DATABASE IF NOT EXISTS verified_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE verified_rental;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('seeker','owner','broker','admin') NOT NULL DEFAULT 'seeker',
  national_id VARCHAR(120),
  verified TINYINT(1) NOT NULL DEFAULT 0,
  broker_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  INDEX (role),
  INDEX (verified),
  INDEX (broker_verified)
);

CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  city VARCHAR(120) NOT NULL,
  area VARCHAR(120),
  price DECIMAL(12,2) NOT NULL CHECK (price >= 5000 AND price <= 30000),
  rooms INT NOT NULL,
  type ENUM('apartment','house','room','studio','compound') NOT NULL DEFAULT 'apartment',
  photos TEXT,
  available TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  verified TINYINT(1) NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (city),
  INDEX (area),
  INDEX (price),
  INDEX (status)
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending','reviewed','closed') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  UNIQUE KEY user_listing (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  rating TINYINT(1) NOT NULL,
  comment TEXT,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
