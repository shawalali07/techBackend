import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Tag from '../models/tagModel.js'
import generateToken from '../utils/generateToken.js'

//@desc  Auth user and get token
//@route  POST /api/users/admin/login
//@access  Public
const authAdmin = asyncHandler(async (req, res) => {
    //it will give us the data that we sent from the body in postman
    const { email, password } = req.body
    //res.send({email, password})\
    const user = await User.findOne({ email })//get the email from db
    if (user && (await user.matchPassword(password)) && user.isAdmin == "true") {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401)
        throw new Error('Invalid email or password')
    }

})

// @desc    Update user
// @route   PUT /api/admin/:userId
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Delete user
// @route   DELETE /api/admin/:userId
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    POST tag
// @route   POST /api/admin/tag
// @access  Private/Admin
export const addTag = asyncHandler(async (req, res) => {
    try {
        const { tag } = req.body

        const tagExist = await Tag.find({ tag: tag.toLowerCase() }).count()
        if (!tagExist) {
            await Tag.create({
                tag: tag.toLowerCase()
            })
            res.status(201).json({
                success: true,
                data: tag.toLowerCase(),
            })
        }
        else {
            res.status(400).json({
                success: false,
                message: "Tag already exists"
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
        })
    }
})

// @desc    DELETE tag
// @route   DELETE /api/admin/tag/:tagId
// @access  Private/Admin
export const deleteTag = asyncHandler(async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id)
        await tag.remove()
        res.status(201).json({
            success: true,
            message: 'Tag removed'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
        })
    }
})

// @desc    FETCH tags
// @route   GET /api/admin/tag/:tagId
// @access  Private/Admin
export const getTags = asyncHandler(async (req, res) => {
    try {
        const tags = await Tag.find()
        res.status(201).json({
            success: true,
            data: tags
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Tags not found!"
        })
    }
})

export {
    authAdmin,
    updateUser,
    deleteUser
}
