import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateTokens = ({ _id, username }) => {

    const payload = {
        userId: _id.toString(),
        username,
    }

    // Generate opaque refresh token (random string)
    const refreshToken = crypto.randomBytes(64).toString('hex')

    return {
        accessToken: jwt.sign(payload, process.env.accessTokenSecret, { expiresIn: '15m' }),
        refreshToken,
        userId: _id.toString() // Include userId for storing in DB
    }
}
