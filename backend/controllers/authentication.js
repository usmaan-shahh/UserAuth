import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { generateTokens } from '../utils/generateTokens.js'
import { cookieOptions } from '../utils/cookieOptions.js'

export const register = async (req, res, next) => {
    try {

      const { username, password } = req.body

      const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
  
      if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
      }
  
      const hashedPwd = await bcrypt.hash(password, 10)
  
      const user = await User.create({
        username,
        password: hashedPwd
      })
  
      const { accessToken, refreshToken } = generateTokens(user)

      res.cookie('jwt', refreshToken, cookieOptions)
  
      return res.status(201).json({ message: 'Signup successful', accessToken})
  
    } catch (err) {

      next(err)

    }
  }

export const login = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

      const { accessToken, refreshToken } = generateTokens(foundUser)

      res.cookie('jwt', refreshToken, cookieOptions)
  
      return res.status(201).json({ message: 'Login successful', accessToken})


   

}

export const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

export const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    
                        "username": foundUser.username,
                        "userId": foundUser._id.toString()
                    
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}



