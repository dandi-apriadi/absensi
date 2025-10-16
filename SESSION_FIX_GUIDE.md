# 🔧 Session Cookie Fix - Development Guide

## 📋 Problem Analysis

### Issue
Session cookies tidak tersimpan dengan benar, menyebabkan error:
```
❌ No user_id in session - returning 401
Session cookie: secure=true, sameSite=none
```

### Root Causes
1. **NODE_ENV=production** di environment development (localhost)
2. **Cookie secure=true** tanpa HTTPS di localhost
3. **Cookie sameSite=none** membutuhkan secure=true + HTTPS
4. **Trust proxy=true** tidak diperlukan di localhost

## ✅ Solutions Applied

### 1. Environment Configuration (.env)
```properties
# BEFORE (❌ WRONG for localhost)
NODE_ENV=production
TRUST_PROXY=true

# AFTER (✅ CORRECT for localhost)
NODE_ENV=development
TRUST_PROXY=false
SESSION_COOKIE_SECURE=false
SESSION_SAMESITE=lax
```

### 2. Session Configuration (index.js)
**Simplified for development:**
- ✅ Removed complex auto-detection logic
- ✅ Set explicit values based on environment
- ✅ Default to `secure=false` & `sameSite=lax` for localhost
- ✅ Clear logging for debugging

### 3. Enhanced Logging
**Added detailed logs in:**
- ✅ `authController.js` - Login session creation
- ✅ `AuthUser.js` - Session verification
- ✅ `index.js` - Cookie configuration

## 🚀 Testing Guide

### Step 1: Restart Backend
```bash
cd backend
nodemon index
```

**Expected output:**
```
Session cookie config: {
  sameSite: 'lax',
  cookieSecure: false,
  cookieDomain: undefined,
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:5000',
  isProd: false,
  crossSite: false
}
```

### Step 2: Test Login
1. Login via frontend
2. Check backend console for:
```
=== LOGIN SESSION DETAILS ===
Session ID: xxxxx
Session user_id: [your-user-id]
Session role: [your-role]
Cookie settings: { 
  secure: false, 
  sameSite: 'lax',
  httpOnly: true 
}
✅ Session saved successfully
```

### Step 3: Verify Session Persistence
1. Refresh page or navigate
2. Check `/api/auth/me` endpoint
3. Should see:
```
=== VERIFY USER MIDDLEWARE ===
Session user_id: [your-user-id]
Session role: [your-role]
✅ User verified
```

## 🔍 Debugging Checklist

### If session still not working:

#### 1. Check Browser Cookies
- Open DevTools → Application → Cookies
- Look for `iot.session.id`
- Verify: `Secure: false`, `SameSite: Lax`

#### 2. Check Network Tab
- Login request should return `Set-Cookie` header
- Subsequent requests should include `Cookie` header

#### 3. Clear Old Sessions
```sql
TRUNCATE TABLE sessions;
```

#### 4. Verify .env loaded
```javascript
console.log('ENV:', {
  NODE_ENV: process.env.NODE_ENV,
  TRUST_PROXY: process.env.TRUST_PROXY,
  SESSION_COOKIE_SECURE: process.env.SESSION_COOKIE_SECURE,
  SESSION_SAMESITE: process.env.SESSION_SAMESITE
});
```

## 📦 Production Configuration

### For VPS/Production with HTTPS:
```properties
NODE_ENV=production
TRUST_PROXY=true
SESSION_COOKIE_SECURE=true
SESSION_SAMESITE=none
CLIENT_ORIGIN=https://yourdomain.com
BASE_URL=https://api.yourdomain.com
```

### For Same-Origin Production:
```properties
NODE_ENV=production
TRUST_PROXY=true
SESSION_COOKIE_SECURE=true
SESSION_SAMESITE=lax
CLIENT_ORIGIN=https://yourdomain.com
BASE_URL=https://yourdomain.com
```

## 🎯 Key Takeaways

1. **Development (localhost):**
   - `secure=false` ✅
   - `sameSite=lax` ✅
   - `NODE_ENV=development` ✅

2. **Production (HTTPS):**
   - `secure=true` ✅
   - `sameSite=none` (cross-site) or `lax` (same-site) ✅
   - `NODE_ENV=production` ✅

3. **Cookie Rules:**
   - `SameSite=none` REQUIRES `Secure=true` (HTTPS)
   - `SameSite=lax` works with HTTP (localhost)
   - `Secure=true` requires HTTPS

## 📝 Files Modified

1. ✅ `backend/.env` - Environment configuration
2. ✅ `backend/index.js` - Session middleware configuration
3. ✅ `backend/controllers/shared/authController.js` - Enhanced logging

## 🔗 Related Documentation

- [Express Session](https://github.com/expressjs/session)
- [Cookie SameSite Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Secure Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security)

---

**Last Updated:** October 16, 2025
**Status:** ✅ Fixed and Tested
