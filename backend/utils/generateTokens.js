import jwt from 'jsonwebtoken'

export const generateTokens = ({ _id, username }) => {

    const payload = {
        userId: _id.toString(),
        username,
    }

    return {
        accessToken: jwt.sign(payload, process.env.accessTokenSecret, { expiresIn: '13m' }),
        refreshToken: jwt.sign(payload, process.env.refreshTokenSecret, { expiresIn: '1d' })
    }
}
