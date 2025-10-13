import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import SequelizeStore from "connect-session-sequelize";
import helmet from "helmet";
import db, { ensureDatabaseConnection } from "./config/Database.js";
import AllRoutes from "./routes/routes-backend.js";
dotenv.config();

// Pastikan app dideklarasikan sebelum dipakai
const app = express();

// When behind a reverse proxy (Nginx, Cloudflare), trust the proxy so secure cookies work in production
// You can disable by setting TRUST_PROXY=false in env
if ((process.env.TRUST_PROXY || 'true').toLowerCase() !== 'false') {
    app.set('trust proxy', 1);
}

// Determine allowed origin(s)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || process.env.CORS_ORIGIN || "http://localhost:3001";
app.use(
    cors({
        credentials: true,
        origin: CLIENT_ORIGIN,
    })
);

const sessionStore = SequelizeStore(session.Store);

// Create session store with database
const store = new sessionStore({
    db: db,
});

// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.static("public")); // Serve static files

app.use(
    fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
        abortOnLimit: true,
        responseOnLimit: "File terlalu besar",
        createParentPath: true,
        useTempFiles: true,
        tempFileDir: "/tmp/",
        preserveExtension: true,
        safeFileNames: true,
    })
);

// Session Configuration
const isProd = process.env.NODE_ENV === 'production';
// Auto-detect cross-site if origin host differs from base URL host
const FRONTEND_URL = CLIENT_ORIGIN;
const BACKEND_URL = process.env.BASE_URL || `http://localhost:${process.env.APP_PORT || process.env.PORT || 5001}`;
const frontendHost = (() => { try { return new URL(FRONTEND_URL).host; } catch { return ''; } })();
const backendHost = (() => { try { return new URL(BACKEND_URL).host; } catch { return ''; } })();
const inferredCrossSite = frontendHost && backendHost && frontendHost !== backendHost;
const crossSite = inferredCrossSite || (process.env.CROSS_SITE_COOKIES || 'false').toLowerCase() === 'true';
let sameSite = (process.env.SESSION_SAMESITE || (crossSite ? 'none' : 'lax')).toLowerCase();
if (!['lax', 'strict', 'none'].includes(sameSite)) sameSite = 'lax';
const cookieSecure = isProd || sameSite === 'none'; // SameSite=None requires Secure

// Derive cookie domain if not provided: use eTLD+1 (e.g., siabsensi.site) to cover apex and www
let cookieDomain = process.env.COOKIE_DOMAIN || undefined;
if (!cookieDomain) {
    const hostname = backendHost?.split(':')[0] || '';
    const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    const isLocalhost = hostname === 'localhost';
    if (hostname && !isIp && !isLocalhost) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            cookieDomain = `.${parts.slice(-2).join('.')}`;
        }
    }
}

console.log('Session cookie config:', { sameSite, cookieSecure, cookieDomain, FRONTEND_URL, BACKEND_URL });

app.use(
    session({
        secret: process.env.SESS_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            secure: cookieSecure, // requires HTTPS if SameSite=None
            httpOnly: true,
            sameSite: sameSite,
            domain: cookieDomain,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// Database initialization
const initDatabase = async () => {
    try {
        const ok = await ensureDatabaseConnection();
        if (!ok) {
            console.error('❌ Unable to establish database connection after retries.');
            return false;
        }
        console.log('✅ Database connection established (post-retry check).');

        // Import all models to ensure they are registered
        console.log('📋 Loading models...');
        await import('./models/index.js');

        console.log('🔄 Synchronizing database...');

        // Use force: false and alter: false for production safety
        // If you need to reset database, run: node resetDatabase.js
        await db.sync({
            force: false,
            alter: false,
            hooks: false
        });

        console.log('✅ Database synchronized successfully');

        // Ensure session table exists and is up-to-date
        if (typeof store.sync === 'function') {
            await store.sync();
            console.log('✅ Session store synchronized');
        }
        return true;
    } catch (error) {
        console.error('❌ Database initialization error:', error.name, error.message);

        if (error.name === 'SequelizeDatabaseError' && error.original?.code === 'ER_WRONG_AUTO_KEY') {
            console.log('');
            console.log('🔧 SOLUTION: This error occurs when there are conflicting auto_increment columns.');
            console.log('   Run the following command to reset your database:');
            console.log('   node resetDatabase.js');
            console.log('');
            console.log('   Then run your application again.');
            console.log('');
        }

        return false;
    }
};

// Prefer APP_PORT then PORT then default 5001
const PORT = process.env.APP_PORT || process.env.PORT || 5001;

// Wrap server initialization in IIFE
(async () => {
    try {
        const dbInitialized = await initDatabase();

        if (!dbInitialized) {
            console.error('Failed to initialize database');
            process.exit(1);
        }

        // Routes
        app.use(AllRoutes);
        // Global error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: "Internal Server Error" });
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server initialization failed:', error);
        process.exit(1);
    }
})();
