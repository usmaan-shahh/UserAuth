import { User } from "../models/User"

export const updateUser = async (req, res) => {

    const id = req.userId 

    const {  username, password } = req.body

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // This prevents updating a user to a username that already belongs to another user. 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'username already taken by another user' })
    }

    if (username) {
        user.username = username
      }
      
    if (password) {
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}


export const deleteUser = async (req, res) => {
   
    const id = req.userId

 
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }


   
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}
