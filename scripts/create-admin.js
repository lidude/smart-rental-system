const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
    const schema = fs.readFileSync(path.join(__dirname, '..', 'models', 'schema.sql'), 'utf8');
    await connection.query(schema);
    await connection.end();

    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'verified_rental',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin1234';
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (existing.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO users (name, email, phone, password, role, national_id, verified, broker_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        ['Admin User', adminEmail, '0911000002', hash, 'admin', null, 1, 0]
      );
      console.log('Admin user created:', adminEmail, 'password:', adminPassword);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  }
})();
