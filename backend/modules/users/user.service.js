import bcrypt from 'bcryptjs'
import User from './user.model.js'
import { generateTokens } from '../../utils/generateTokens.js'


// export const refreshToken = (refreshToken) => {

//   if (!refreshToken) throw new Error('UNAUTHORIZED')

//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async (err, decoded) => {
//       if (err) throw new Error('FORBIDDEN')

//       const foundUser = await User.findOne({ username: decoded.username }).exec()

//       if (!foundUser) throw new Error('UNAUTHORIZED')
//       const accessToken = jwt.sign(
//         {

//           "username": foundUser.username,
//           "userId": foundUser._id.toString()

//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '15m' }
//       )

//       res.json({ accessToken })
//     }
//   )
// }

// export const updateUser = async (id, payload) => {

//   const user = await User.findById(id).exec()

//   if (!user) {
//     throw new Error("USER_NOT_FOUND");
//   }

//   if (payload.username) {
//     const duplicate = await User.findOne({ username: payload.username })
//       .collation({ locale: "en", strength: 2 })
//       .lean()
//       .exec();
//   }

//   // This prevents updating a user to a username that already belongs to another user.
//   if (duplicate && duplicate?._id.toString() !== id) {
//     throw new Error({ message: 'username already taken by another user' })
//   }

//   user.username = payload.username;

//   if (payload.password) {
//     user.password = await bcrypt.hash(payload.password, 10)
//   }

//   await user.save()

// }

// export const deleteUser = async (req, res) => {

//   const id = req.userId


//   if (!id) {
//     return res.status(400).json({ message: 'User ID Required' })
//   }



//   const user = await User.findById(id).exec()

//   if (!user) {
//     return res.status(400).json({ message: 'User not found' })
//   }

//   const result = await user.deleteOne()

//   const reply = `Username ${result.username} with ID ${result._id} deleted`

//   res.json(reply)
// }


