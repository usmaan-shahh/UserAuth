import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: true,
      index: true
    },
    
    tokenHash: {
      type: String,
      required: true
    },
    
    deviceInfo: {
      deviceName: {
        type: String,
        default: 'Unknown Device'
      },
      deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'unknown'],
        default: 'unknown'
      },
      browser: String,
      os: String,
      userAgent: String
    },
    
    ipAddress: {
      type: String
    },
    
    // For suspicious activity detection
    location: {
      country: String,
      city: String,
      region: String
    },
    
    lastUsedAt: {
      type: Date,
      default: Date.now
    },
    
    expiresAt: {
      type: Date,
      required: true
    },
    
    isRevoked: {
      type: Boolean,
      default: false
    },
    
    // Track if this is a suspicious login
    isSuspicious: {
      type: Boolean,
      default: false
    },
    
    // Reason for suspicion (new location, new device, etc.)
    suspicionReason: String
  },
  {
    timestamps: true
  }
)

// TTL Index - MongoDB will automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Compound index for efficient queries
refreshTokenSchema.index({ userId: 1, isRevoked: 1 })
refreshTokenSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('RefreshToken', refreshTokenSchema)

