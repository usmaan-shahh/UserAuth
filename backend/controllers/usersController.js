import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'


const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

const createNewUser = async (req, res, next) => {
    try {

        const { username, password } = req.body;

        const duplicate =

            await User.findOne({ username })
                .collation({ locale: 'en', strength: 2 })
                .lean()
                .exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate username' });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const userObject = {
            username,
            password: hashedPwd,
        };

        await User.create(userObject);

        res.status(201).json({
            message: `New user ${username} created`
        });

    } catch (err) {

        next(err);

    }
};


const updateUser = async (req, res) => {

    const { id, username, password } = req.body
console.log(id, username, password)
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



    if (password) {
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}


const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }


    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

export { getAllUsers, createNewUser, updateUser, deleteUser }   