import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Allow either DATABASE_URL (e.g. for Postgres) or discrete MySQL env vars
// Current dependencies only support MySQL (mysql2). If you want Postgres, install 'pg' and 'pg-hstore'.

const {
    DATABASE_URL,
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_NAME = 'elearning',
    DB_USER = 'root',
    DB_PASS = '',
    DB_DIALECT = 'mysql'
} = process.env;

let db;

try {
    if (DATABASE_URL) {
        db = new Sequelize(DATABASE_URL, {
            logging: false,
            dialectOptions: {
                // Optional SSL support if needed later
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        console.log(`📦 Using DATABASE_URL with dialect inferred from connection string.`);
    } else {
        db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
            host: DB_HOST,
            port: Number(DB_PORT),
            dialect: DB_DIALECT,
            logging: false,
            define: {
                freezeTableName: true
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        console.log(`📦 Database configuration: { host: ${DB_HOST}, port: ${DB_PORT}, db: ${DB_NAME}, user: ${DB_USER}, dialect: ${DB_DIALECT} }`);
    }
} catch (err) {
    console.error('❌ Failed to construct Sequelize instance:', err.message);
    throw err;
}

export default db;

// Optional helper to ensure connection with retries (can be used in index.js if desired)
export async function ensureDatabaseConnection(retries = parseInt(process.env.DB_CONNECT_RETRIES || '0', 10), delayMs = 2000) {
    let attempt = 0;
    while (true) {
        try {
            await db.authenticate();
            if (attempt > 0) {
                console.log(`✅ Database connected after retry #${attempt}`);
            }
            return true;
        } catch (err) {
            attempt++;
            if (attempt > retries) {
                console.error(`❌ Database connection failed after ${attempt} attempt(s):`, err.message);
                return false;
            }
            console.warn(`⚠️  DB connect failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`, err.message);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}