# Device-Based Sessions - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Installation Complete ✅
All dependencies are already installed:
- `ua-parser-js` - Device detection
- `geoip-lite` - Location tracking

### 2. Environment Variables
Ensure these are in your `.env` file:
```env
accessTokenSecret=your_secret_here
refreshTokenSecret=your_secret_here
```

### 3. Start Your Server
```bash
cd backend
npm start
```

---

## 📝 Quick Test

### Test 1: Login and Get Sessions

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "your_username",
    "password": "your_password",
    "deviceName": "My Test Device"
  }'

# Save the accessToken from response

# 2. View all sessions
curl http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -b cookies.txt
```

### Test 2: Multiple Devices

```bash
# Login from "iPhone"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" \
  -d '{
    "username": "your_username",
    "password": "your_password",
    "deviceName": "My iPhone"
  }'

# Login from "Desktop"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{
    "username": "your_username",
    "password": "your_password",
    "deviceName": "My Desktop"
  }'
```

---

## 🎯 Key Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | ❌ | Login with device tracking |
| `/api/auth/sessions` | GET | ✅ | View all active sessions |
| `/api/auth/sessions/:id` | DELETE | ✅ | Logout specific device |
| `/api/auth/sessions/revoke-all-others` | POST | ✅ | Logout all except current |
| `/api/auth/logout` | POST | ❌ | Logout current device |

---

## 💡 Common Use Cases

### Use Case 1: User Views Their Devices
```javascript
// Frontend code
const sessions = await fetch('/api/auth/sessions', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
}).then(r => r.json());

console.log(sessions);
// Shows: iPhone, Desktop, iPad, etc.
```

### Use Case 2: User Logs Out from Stolen Device
```javascript
// User sees suspicious session
const suspiciousSessionId = "65f1a2b3c4d5e6f7g8h9i0j1";

await fetch(`/api/auth/sessions/${suspiciousSessionId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Use Case 3: User Changes Password
```javascript
// After password change, logout all devices
await fetch('/api/auth/sessions/revoke-all', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

---

## 🔍 Troubleshooting

### Issue: "Location is null"
**Cause**: Using localhost or private IP  
**Solution**: Normal behavior. Location only works with public IPs in production

### Issue: "Session not found"
**Cause**: Session already expired or revoked  
**Solution**: Check `expiresAt` field. Tokens expire after 7 days

### Issue: "Maximum devices reached"
**Cause**: User has 5 active sessions  
**Solution**: Automatic - oldest session is auto-revoked. Or manually revoke via API

### Issue: "Suspicious activity warning"
**Cause**: Login from new location + new browser  
**Solution**: Normal behavior. Inform user and let them proceed

---

## 📊 Check MongoDB

```javascript
// In MongoDB shell or Compass
use your_database_name;

// View all refresh tokens
db.refreshtokens.find().pretty();

// View sessions for specific user
db.refreshtokens.find({ userId: ObjectId("USER_ID_HERE") }).pretty();

// Count active sessions
db.refreshtokens.countDocuments({ isRevoked: false });

// View suspicious logins
db.refreshtokens.find({ isSuspicious: true }).pretty();
```

---

## 🎨 Frontend UI Example

### Session Management Component (React)

```jsx
import { useState, useEffect } from 'react';

function SessionManager() {
  const [sessions, setSessions] = useState([]);
  
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const fetchSessions = async () => {
    const response = await fetch('/api/auth/sessions', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    setSessions(data.sessions);
  };
  
  const revokeSession = async (sessionId) => {
    await fetch(`/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    fetchSessions(); // Refresh list
  };
  
  return (
    <div>
      <h2>Active Devices</h2>
      {sessions.map(session => (
        <div key={session.id} className="session-card">
          <div>
            <strong>{session.deviceName}</strong>
            <span>{session.browser} on {session.os}</span>
            {session.isSuspicious && (
              <span className="warning">⚠️ Suspicious</span>
            )}
          </div>
          <div>
            <small>Last used: {new Date(session.lastUsedAt).toLocaleString()}</small>
            <small>Location: {session.location?.city}, {session.location?.country}</small>
          </div>
          <button onClick={() => revokeSession(session.id)}>
            Logout
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚙️ Configuration Options

Edit `backend/modules/auth/auth.service.js`:

```javascript
// Change maximum devices per user
const MAX_DEVICES_PER_USER = 5; // Change to 3, 10, etc.

// Change token expiry
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Change to 14, 30, etc.
```

---

## 📱 Test with Postman/Insomnia

1. **Import** the `test-sessions.http` file
2. **Set variables**:
   - `baseUrl`: `http://localhost:3000/api/auth`
   - `accessToken`: (get from login response)
3. **Run tests** in sequence

---

## 🎓 Learn More

- Full API Documentation: `DEVICE_SESSIONS.md`
- Implementation Details: `../IMPLEMENTATION_SUMMARY.md`
- Test Examples: `test-sessions.http`

---

## ✅ Checklist

Before going to production:

- [ ] Environment variables set
- [ ] MongoDB indexes created (automatic)
- [ ] Test login from multiple devices
- [ ] Test session revocation
- [ ] Test device limit (login 6 times)
- [ ] Test suspicious activity detection
- [ ] Update frontend to show session management
- [ ] Configure production cookie settings
- [ ] Set up monitoring/logging

---

## 🎉 You're Ready!

The device-based session system is now active. Users can:
- ✅ Login from multiple devices
- ✅ View all active sessions
- ✅ Logout from specific devices
- ✅ Get warnings for suspicious activity
- ✅ Manage their security

**Happy coding!** 🚀

