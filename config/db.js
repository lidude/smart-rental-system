const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const dbName = process.env.DB_NAME || 'verified_rental';
let pool;

function getConnectionConfig() {
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname ? url.pathname.slice(1) : dbName
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName
  };
}

async function initDatabase() {
  const connectionConfig = getConnectionConfig();
  const connection = await mysql.createConnection({
    host: connectionConfig.host,
    user: connectionConfig.user,
    password: connectionConfig.password,
    multipleStatements: true
  });
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'models', 'schema.sql'), 'utf8');
  await connection.query(schemaSql);
  await connection.end();

  pool = mysql.createPool({
    host: connectionConfig.host,
    port: connectionConfig.port,
    user: connectionConfig.user,
    password: connectionConfig.password,
    database: connectionConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

function getPool() {
  if (!pool) {
    throw new Error('Database has not been initialized. Call initDatabase() before using getPool().');
  }
  return pool;
}

module.exports = { initDatabase, getPool };
