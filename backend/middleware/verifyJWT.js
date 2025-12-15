import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization 

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(

        token, //the JWT string from client 

        process.env.ACCESS_TOKEN_SECRET,
        
        (error, decoded) => {
            if (error) return res.status(403).json({ message: 'Forbidden' })

                req.auth = {
                    user: decoded.username,
                    userId: decoded.userId,
                  };
                  
            next()
        }

    )
}

export default verifyJWT