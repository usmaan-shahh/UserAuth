import jwt from 'jsonwebtoken'

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        
        token,

        process.env.ACCESS_TOKEN_SECRET,
        
        (error, decoded) => {
            if (error) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.username
            req.userId = decoded.userId 
            next()
        }

    )
}

export default verifyJWT 