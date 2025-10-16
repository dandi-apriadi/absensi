# 🔧 UUID Primary Key Fix - User Management

## 📋 Problem Analysis

### Error Log
```javascript
editUser object: {
  id: undefined, 
  full_name: 'grace busuh',
  email: 'gracebusuh@gmail.com',
  user_id: '39ae36f8-a7e3-478c-b975-af3d6d441899',  // ✅ This is the actual primary key!
  phone: '',
  ...
}
editUser.id: undefined
```

### Root Cause
The database uses **UUID as primary key** (`user_id`), not auto-increment `id`:

**Database Schema:**
```javascript
const User = db.define('users', {
    user_id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
        primaryKey: true,  // ✅ This is the PRIMARY KEY!
        allowNull: false
    },
    // ... other fields
});
```

**Backend was using:**
```javascript
// ❌ WRONG - trying to parse UUID as integer
const user = await Users.findByPk(parseInt(id));
```

**Frontend was looking for:**
```javascript
// ❌ WRONG - expecting 'id' field
id: u.id || u.user_id  // u.id doesn't exist!
```

## ✅ Solutions Applied

### 1. Frontend Mapping Fix

**File:** `frontend/src/views/super-admin/user-management/index.jsx`

**Before (❌ Wrong):**
```javascript
const userId = u.id || u.user_id; // u.id is undefined!

return {
    id: userId,  // Will be undefined
    user_id: u.user_id || '-',
    // ...
};
```

**After (✅ Correct):**
```javascript
// user_id is the primary key (UUID), use it as id
const primaryId = u.user_id; // Backend uses user_id as primary key

return {
    id: primaryId,  // Now using user_id (UUID) as identifier
    user_id: u.user_id || '-',
    // ...
};
```

### 2. Backend Controller Fixes

**File:** `backend/controllers/administrator/userManagementController.js`

#### A. Update User Function

**Before (❌ Wrong):**
```javascript
export const updateUser = async (req, res) => {
    const { id } = req.params;
    
    // ❌ parseInt fails on UUID strings
    const user = await Users.findByPk(parseInt(id));
    
    // ❌ Wrong field name
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await Users.findOne({
            where: {
                email: updateData.email,
                id: { [db.Sequelize.Op.ne]: parseInt(id) }  // Wrong!
            }
        });
    }
};
```

**After (✅ Correct):**
```javascript
export const updateUser = async (req, res) => {
    const { id } = req.params;
    
    // ✅ Don't parseInt, user_id is UUID string
    const user = await Users.findByPk(id);
    
    // ✅ Use user_id field
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await Users.findOne({
            where: {
                email: updateData.email,
                user_id: { [db.Sequelize.Op.ne]: id }  // Correct!
            }
        });
    }
    
    // ✅ Don't allow changing user_id (it's the primary key)
    delete updateData.user_id;
};
```

#### B. Delete User Function

**Before (❌ Wrong):**
```javascript
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    // ❌ Wrong comparison
    if (parseInt(id) === req.session.userId) {
        return res.status(400).json({
            message: "Tidak dapat menghapus akun sendiri"
        });
    }
    
    // ❌ parseInt fails on UUID
    const user = await Users.findByPk(parseInt(id));
};
```

**After (✅ Correct):**
```javascript
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    // ✅ Direct string comparison
    if (id === req.session.user_id) {
        return res.status(400).json({
            message: "Tidak dapat menghapus akun sendiri"
        });
    }
    
    // ✅ Don't parseInt, user_id is UUID string
    const user = await Users.findByPk(id);
};
```

#### C. Update User Status Function

**Before (❌ Wrong):**
```javascript
export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    
    // ❌ Wrong comparison
    if (parseInt(id) === req.session.userId && status === 'suspended') {
        return res.status(400).json({...});
    }
    
    // ❌ parseInt fails on UUID
    const user = await Users.findByPk(parseInt(id));
    
    res.status(200).json({
        data: {
            user: {
                id: user.id,  // ❌ This doesn't exist
                user_id: user.user_id,
                // ...
            }
        }
    });
};
```

**After (✅ Correct):**
```javascript
export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    
    // ✅ Direct string comparison
    if (id === req.session.user_id && status === 'suspended') {
        return res.status(400).json({...});
    }
    
    // ✅ Don't parseInt, user_id is UUID string
    const user = await Users.findByPk(id);
    
    res.status(200).json({
        data: {
            user: {
                user_id: user.user_id,  // ✅ Only user_id exists
                // ...
            }
        }
    });
};
```

#### D. Get User By ID Function

**Before (❌ Wrong):**
```javascript
export const getUserById = async (req, res) => {
    const { id } = req.params;
    
    // ❌ parseInt fails on UUID
    const user = await getUserWithRoleDetails(parseInt(id));
};
```

**After (✅ Correct):**
```javascript
export const getUserById = async (req, res) => {
    const { id } = req.params;
    
    // ✅ Don't parseInt, user_id is UUID string
    const user = await Users.findByPk(id);
};
```

## 🎯 Key Changes Summary

### Frontend Changes:
1. ✅ Use `u.user_id` directly as primary identifier
2. ✅ Map `user_id` to `id` field for API calls
3. ✅ Remove fallback to `u.id` (doesn't exist)

### Backend Changes:
1. ✅ Remove `parseInt()` calls on `user_id` (it's a UUID string)
2. ✅ Use `user_id` field in WHERE clauses, not `id`
3. ✅ Compare `user_id` strings directly, not as integers
4. ✅ Don't expose non-existent `id` field in responses
5. ✅ Prevent changing `user_id` in updates (it's the primary key)

## 🔍 Understanding UUID vs Auto-increment

### Auto-increment ID (Traditional):
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Numeric, sequential
    email VARCHAR(255)
);

-- IDs: 1, 2, 3, 4, 5...
```

### UUID Primary Key (This Project):
```sql
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,  -- UUID string
    email VARCHAR(255)
);

-- IDs: '39ae36f8-a7e3-478c-b975-af3d6d441899'
--      'f2c1d4b5-6e7f-8a9b-0c1d-2e3f4a5b6c7d'
```

### Implications:

| Operation | Auto-increment | UUID |
|-----------|---------------|------|
| Find by PK | `findByPk(parseInt(id))` | `findByPk(id)` |
| Compare IDs | `parseInt(id) === userId` | `id === userId` |
| URL param | `/users/123` | `/users/39ae36f8...` |
| Field name | Usually `id` | `user_id` in this project |

## 🧪 Testing Steps

### 1. Load User List
```javascript
// Check console:
Processing user 1: {user_id: '39ae36f8...', full_name: 'Grace', ...}
id field: undefined  // ❌ This is OK now
user_id field: 39ae36f8-a7e3-478c-b975-af3d6d441899
Final primaryId: 39ae36f8-a7e3-478c-b975-af3d6d441899  // ✅
```

### 2. Click Edit Button
```javascript
// Check console:
=== EDIT USER CLICKED ===
User ID: 39ae36f8-a7e3-478c-b975-af3d6d441899  // ✅ Has value now!
User user_id: 39ae36f8-a7e3-478c-b975-af3d6d441899
```

### 3. Submit Edit
```javascript
// Check console:
=== UPDATE USER ===
editUser.id: 39ae36f8-a7e3-478c-b975-af3d6d441899  // ✅ Has value!
Calling apiUpdateUser with ID: 39ae36f8-a7e3-478c-b975-af3d6d441899

// Check network:
PUT /api/admin/users/39ae36f8-a7e3-478c-b975-af3d6d441899
Status: 200 OK  // ✅ Success!
```

### 4. Check Backend Logs
```
Find user by user_id: 39ae36f8-a7e3-478c-b975-af3d6d441899
User found: ✅
User updated successfully
```

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
```javascript
// Don't parseInt UUIDs
parseInt('39ae36f8-a7e3-478c-b975-af3d6d441899')  // Returns NaN

// Don't compare UUID to number
if (parseInt(uuid) === 123) { ... }  // Always false

// Don't look for 'id' field when it doesn't exist
const userId = user.id;  // undefined!
```

### ✅ DO:
```javascript
// Use UUID strings directly
const uuid = '39ae36f8-a7e3-478c-b975-af3d6d441899';

// Compare UUIDs as strings
if (uuid === req.session.user_id) { ... }

// Use the actual primary key field name
const userId = user.user_id;  // Correct!
```

## 📝 Files Modified

1. ✅ `frontend/src/views/super-admin/user-management/index.jsx`
   - Fixed data mapping to use `user_id` as primary identifier
   
2. ✅ `backend/controllers/administrator/userManagementController.js`
   - Fixed `updateUser` - removed parseInt, use user_id
   - Fixed `deleteUser` - removed parseInt, use user_id
   - Fixed `updateUserStatus` - removed parseInt, use user_id
   - Fixed `getUserById` - removed parseInt, use user_id

## ✨ Benefits

1. ✅ **Edit works** - Can now update users successfully
2. ✅ **Delete works** - Can now delete users successfully
3. ✅ **Status toggle works** - Can now change user status
4. ✅ **No more 404 errors** - Correct primary key used
5. ✅ **Type-safe** - No more parseInt() on strings
6. ✅ **Consistent** - Frontend and backend aligned on primary key

---

**Last Updated:** October 16, 2025  
**Status:** ✅ Fixed and Tested  
**Primary Key:** `user_id` (UUID string)
