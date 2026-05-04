# PostgreSQL Migration Guide

Your Kasthamandap Ghar backend has been successfully migrated from MongoDB to PostgreSQL! Here's what you need to do to get it running.

## What Changed

✅ **Already Completed:**
- Replaced MongoDB with Sequelize ORM + PostgreSQL
- Updated all models (User, Product, Order, Booking, Payment)
- Updated all controllers to use Sequelize queries
- Updated middleware and server configuration
- Updated package.json dependencies

## Setup Steps

### 1. **Install PostgreSQL**

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run installer and set a password for the `postgres` user
- Remember your password - you'll need it in step 3

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

### 2. **Create Database**

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE kasthamandapghar;
```

---

### 3. **Update .env File**

Edit `backend/.env` and set your PostgreSQL credentials:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kasthamandapghar
DB_USER=postgres
DB_PASSWORD=your_postgres_password  ← Change this!

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_for_kasthamandapghar_2024

# Server Configuration
PORT=5000
NODE_ENV=development
```

Replace `your_postgres_password` with the password you set during PostgreSQL installation.

---

### 4. **Install Dependencies**

```bash
cd backend
npm install
```

---

### 5. **Start the Server**

```bash
npm run dev
# or
npm start
```

You should see:
```
✓ PostgreSQL Connected Successfully
✓ Database synchronized
✓ Server running on port 5000 in development mode
```

---

## What Happens Automatically

When the server starts for the first time:
- ✓ All tables are created automatically (Users, Products, Orders, Bookings, Payments)
- ✓ Relationships between tables are established
- ✓ Database schema is synced

**No manual SQL scripts needed!**

---

## Data Migration (If You Have Existing MongoDB Data)

If you want to transfer your existing MongoDB data to PostgreSQL:

1. **Export from MongoDB:**
```bash
mongoexport --db kasthamandapghar --collection users --out users.json
mongoexport --db kasthamandapghar --collection products --out products.json
# ... repeat for all collections
```

2. **Import to PostgreSQL:** (Contact me for a migration script)

---

## Testing the Setup

### Test User Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9841234567",
    "address": "Kathmandu"
  }'
```

### Test Get Products:
```bash
curl http://localhost:5000/api/products
```

---

## Common Issues & Solutions

### ❌ Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Solution:** PostgreSQL is not running. Start it:
- **Windows:** Use pgAdmin or Services
- **Mac:** `brew services start postgresql`
- **Linux:** `sudo systemctl start postgresql`

### ❌ Error: "password authentication failed"
**Solution:** Check DB_PASSWORD in .env matches your PostgreSQL password

### ❌ Error: "database does not exist"
**Solution:** Run in PostgreSQL:
```sql
CREATE DATABASE kasthamandapghar;
```

### ❌ Error: "role 'postgres' does not exist"
**Solution:** Use correct username, or create the user

---

## Key Differences (MongoDB → PostgreSQL)

| Feature | MongoDB | PostgreSQL |
|---------|---------|-----------|
| IDs | ObjectId (_id) | UUID (id) |
| Query Method | findById() | findByPk() |
| Find Multiple | find() | findAll() |
| Search Pattern | $regex | Op.iLike (case-insensitive) |
| OR Operator | $or | Op.or |
| Relationships | Reference Ids | Foreign Keys (auto) |
| Nested Objects | Native | JSON type |

---

## Frontend Changes (If Any)

Your API endpoints remain the same, but response formats changed slightly:
- `_id` → `id`
- `user._id` → `user.id`

**Update your frontend if you reference `_id` anywhere:**
```javascript
// Before
const userId = user._id;

// After
const userId = user.id;
```

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Update .env
4. ✅ npm install
5. ✅ npm run dev
6. ✅ Test API endpoints

---

## Questions?

If you encounter any issues, check:
1. PostgreSQL is running
2. .env credentials are correct
3. Database `kasthamandapghar` exists
4. No port conflicts (default: 5432)

---

**Happy coding! Your database is now PostgreSQL-powered! 🚀**
