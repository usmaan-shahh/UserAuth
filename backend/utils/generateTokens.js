export const generateTokens = ({_id, username}) => {

    const payload = {
    userId: _id.toString(),
    username,
    }
    
    return {
            accessToken:  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}),
            refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
    }
}
