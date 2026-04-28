# User Credentials — LuxeShop

## Demo Accounts

After running `npm run seed` in the server directory, use these credentials to test the app.

> **Note**: You must manually create these accounts via the /register endpoint or the Register page, as the seeder only populates products.

### Regular User
- **Email**: demo@luxeshop.com
- **Password**: demo123
- **Role**: user

### Admin User
- **Email**: admin@luxeshop.com
- **Password**: admin123
- **Role**: admin

---

## Creating Accounts

### Via UI
1. Navigate to http://localhost:5173/register
2. Fill in name, email, password
3. Submit — you're logged in automatically

### Via API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Making a User Admin
Connect to MongoDB and run:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## JWT Token

After login, the API returns a JWT token. Include it in subsequent requests:

```
Authorization: Bearer <token>
```

Token expires in: **30 days** (configurable via `JWT_EXPIRE` in `.env`)
