# Device-Based Refresh Token System

## Overview

This authentication system implements device-based refresh tokens, allowing users to maintain multiple active sessions across different devices while providing enhanced security features.

## Features

### ✅ Core Features
- **Multiple Device Support**: Users can be logged in on up to 5 devices simultaneously
- **Device Tracking**: Track device type, browser, OS, and user agent for each session
- **Location Tracking**: IP-based geolocation for suspicious activity detection
- **Session Management**: View and manage all active sessions
- **Selective Logout**: Logout from specific devices or all devices at once

### 🔒 Security Features
- **Suspicious Activity Detection**: Automatically detects unusual login patterns
- **Device Limit Enforcement**: Maximum 5 active devices per user (oldest session auto-revoked)
- **Token Rotation**: Refresh tokens are device-specific and can be individually revoked
- **Automatic Cleanup**: Expired tokens are automatically removed via MongoDB TTL index

## API Endpoints

### Authentication Endpoints

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "deviceName": "My iPhone 13" // Optional
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "deviceName": "My MacBook Pro" // Optional
}
```

**Response (Normal):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (Suspicious Activity Detected):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "warning": {
    "isSuspicious": true,
    "reason": "new location (US), new browser",
    "message": "This login appears unusual. If this wasn't you, please secure your account."
  }
}
```

#### 3. Refresh Token
```http
GET /api/auth/refresh
```

**Response:**
```json
{
  "message": "Token refreshed",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. Logout (Current Device)
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Session Management Endpoints (Protected)

All session management endpoints require authentication via `Authorization: Bearer <accessToken>` header.

#### 5. Get All Active Sessions
```http
GET /api/auth/sessions
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "Sessions retrieved successfully",
  "count": 3,
  "sessions": [
    {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "deviceName": "Chrome on Windows",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows",
      "ipAddress": "192.168.1.100",
      "location": {
        "country": "US",
        "region": "CA",
        "city": "San Francisco"
      },
      "lastUsedAt": "2026-01-03T10:30:00.000Z",
      "createdAt": "2026-01-01T08:00:00.000Z",
      "isSuspicious": false,
      "suspicionReason": null
    },
    {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "deviceName": "My iPhone 13",
      "deviceType": "mobile",
      "browser": "Safari",
      "os": "iOS",
      "ipAddress": "203.0.113.45",
      "location": {
        "country": "US",
        "region": "NY",
        "city": "New York"
      },
      "lastUsedAt": "2026-01-03T09:15:00.000Z",
      "createdAt": "2026-01-02T14:20:00.000Z",
      "isSuspicious": true,
      "suspicionReason": "new location (NY)"
    }
  ]
}
```

#### 6. Revoke Specific Session
```http
DELETE /api/auth/sessions/:sessionId
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "Session revoked successfully",
  "sessionId": "65f1a2b3c4d5e6f7g8h9i0j2"
}
```

#### 7. Revoke All Other Sessions
```http
POST /api/auth/sessions/revoke-all-others
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "All other sessions revoked successfully"
}
```

#### 8. Revoke All Sessions (Logout from All Devices)
```http
POST /api/auth/sessions/revoke-all
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "Logged out from all devices successfully"
}
```

## Database Schema

### RefreshToken Collection

```javascript
{
  userId: ObjectId,              // Reference to AuthUser
  tokenHash: String,             // Bcrypt hash of refresh token
  deviceInfo: {
    deviceName: String,          // e.g., "My iPhone 13"
    deviceType: String,          // mobile | tablet | desktop | unknown
    browser: String,             // e.g., "Chrome"
    os: String,                  // e.g., "Windows"
    userAgent: String            // Full user agent string
  },
  ipAddress: String,             // Client IP address
  location: {
    country: String,             // e.g., "US"
    city: String,                // e.g., "San Francisco"
    region: String               // e.g., "CA"
  },
  lastUsedAt: Date,              // Last time token was used
  expiresAt: Date,               // Token expiration (7 days)
  isRevoked: Boolean,            // Manual revocation flag
  isSuspicious: Boolean,         // Suspicious activity flag
  suspicionReason: String,       // Reason for suspicion
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

## Configuration

### Environment Variables

```env
# JWT Secrets
accessTokenSecret=your_access_token_secret_here
refreshTokenSecret=your_refresh_token_secret_here
```

### Configurable Constants (in auth.service.js)

```javascript
const MAX_DEVICES_PER_USER = 5           // Maximum active devices per user
const REFRESH_TOKEN_EXPIRY_DAYS = 7      // Refresh token validity period
```

## Suspicious Activity Detection

The system automatically detects suspicious login attempts based on:

1. **New Device Type**: User logs in from a device type they haven't used before
2. **New Location**: Login from a country the user hasn't logged in from before
3. **New Browser**: Login using a browser the user hasn't used before

**Threshold**: Activity is marked suspicious if 2 or more factors are new.

### Example Scenarios

| Scenario | Marked Suspicious? |
|----------|-------------------|
| Same device, same location | ❌ No |
| New browser, same location, same device type | ❌ No (only 1 new factor) |
| New browser, new location | ✅ Yes (2 new factors) |
| New device type, new location | ✅ Yes (2 new factors) |
| New device type, new browser, new location | ✅ Yes (3 new factors) |

## Device Limit Enforcement

- **Maximum**: 5 active devices per user
- **Behavior**: When a user logs in on a 6th device, the oldest (least recently used) session is automatically revoked
- **Customization**: Change `MAX_DEVICES_PER_USER` in `auth.service.js`

## Client Implementation Examples

### React/JavaScript Example

```javascript
// Login with device name
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      username,
      password,
      deviceName: 'My MacBook Pro' // Optional custom name
    })
  });
  
  const data = await response.json();
  
  // Check for suspicious activity
  if (data.warning?.isSuspicious) {
    alert(data.warning.message);
  }
  
  // Store access token
  localStorage.setItem('accessToken', data.accessToken);
};

// Get active sessions
const getSessions = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch('/api/auth/sessions', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include'
  });
  
  const data = await response.json();
  return data.sessions;
};

// Revoke specific session
const revokeSession = async (sessionId) => {
  const accessToken = localStorage.getItem('accessToken');
  
  await fetch(`/api/auth/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include'
  });
};

// Logout from all devices
const logoutAllDevices = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  await fetch('/api/auth/sessions/revoke-all', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include'
  });
  
  localStorage.removeItem('accessToken');
};
```

## Security Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Cookies**: Refresh tokens are stored in httpOnly, secure cookies
3. **Short Access Token Expiry**: Access tokens expire in 15 minutes
4. **Token Rotation**: Consider implementing refresh token rotation for extra security
5. **Rate Limiting**: Login endpoint should be rate-limited (already implemented)
6. **Monitor Suspicious Activity**: Log and alert on suspicious login attempts
7. **User Notifications**: Consider sending email notifications for new device logins

## Troubleshooting

### Issue: Sessions not showing up
- Ensure MongoDB TTL index is created (happens automatically on first insert)
- Check that tokens haven't expired (7 days default)

### Issue: Location not detected
- GeoIP only works with public IP addresses
- Local/private IPs (127.0.0.1, 192.168.x.x) won't have location data

### Issue: Too many devices error
- Current limit is 5 devices
- Oldest session is auto-revoked when limit is reached
- Users can manually revoke sessions via the sessions API

## Migration from Old System

If you're migrating from the old single-token system:

1. The `refreshTokenHash` field in `AuthUser` model has been removed
2. Old refresh tokens will become invalid
3. Users will need to log in again after deployment
4. Consider notifying users about the change

## Future Enhancements

Potential improvements to consider:

- [ ] Email notifications for new device logins
- [ ] Push notifications for suspicious activity
- [ ] Geofencing (restrict logins to specific regions)
- [ ] Device fingerprinting for enhanced security
- [ ] Session naming/renaming by users
- [ ] Last login history and audit logs
- [ ] Two-factor authentication integration
- [ ] Trusted device marking (skip 2FA)

## Support

For issues or questions, please refer to the main project documentation or contact the development team.

