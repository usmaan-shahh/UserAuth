import mongoose from 'mongoose'

const authSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,

        },

        email: {
            type: String,
            unique: true,
            sparse: true,          // allows null but enforces uniqueness if email is present
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false       
        },

        roles: {
            type: [String],
            default: ['User']
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        refreshTokenHash: {
            type: String,
            select: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('AuthUser', authSchema)


// Defines the structure of documents in MongoDB

// Trying to “eliminate” race conditions at app level alone is impossible. UNIQUE Index enforces atomic uniqueness at the database level(race - safe)