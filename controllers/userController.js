import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import { v2 as cloudinary } from 'cloudinary'
// import pkg from 'mongoose'
// const { ObjectID } = pkg //try to check the equality of 2 objects

//@desc  Auth user and get token
//@route  POST /api/users/login
//@access  Public
const authUser = asyncHandler(async (req, res) => {
  //it will give us the data that we sent from the body in postman
  const { email, password } = req.body
  //res.send({email, password})\
  const user = await User.findOne({ email })//get the email from db
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      data: user,
      token: generateToken(user._id)
    })
  }
  else {
    res.status(401)
    throw new Error('Invalid email or password')
  }

})

//@desc  Register user
//@route  POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
  //it will give us the data that we sent from the body in postman
  const { name, email, password } = req.body
  const isCompany = req.body.isCompany || false
  const userExists = await User.findOne({ email })//get the email from db

  if (userExists) {
    res.status(400) //bad request
    throw new Error('User already exists')
  }
  //create new user and will trigger save method of mongoose that is defined in userModel
  const user = await User.create({
    name,
    email,
    password,
    isCompany
  })

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

//@desc Get user profile
//@route  GET /api/users/profile
//@access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id) //i can use user._id for any protected router that i want
  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    })
  }
  else {
    res.status(404)
    throw new Error('User not found!')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    if (req.files != null) {
      const file = req.files.photo
      cloudinary.uploader
        .upload(file.tempFilePath)
        .then(async result => {
          user.image = result.url
          user.name = req.body.name || user.name
          user.email = req.body.email || user.email
          user.aboutMe = req.body.aboutMe || user.aboutMe
          user.country = req.body.country || user.country
          user.rate = req.body.rate || user.rate
          user.designation = req.body.designation || user.designation
          if (req.body.skills) {
            if (user.skills.indexOf(req.body.skills) === -1) {
              user.skills.push(req.body.skills)
            }
            else {
              throw new Error('Skill already exist')
            }

          }
          if (req.body.password) {
            user.password = req.body.password
          }

          const updatedUser = await user.save()
          res.status(200).json({
            success: true,
            data: updatedUser,
          })
        })
    } else {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.aboutMe = req.body.aboutMe || user.aboutMe
      user.country = req.body.country || user.country
      user.rate = req.body.rate || user.rate
      user.designation = req.body.designation || user.designation


      if (req.body.password) {
        user.password = req.body.password
      }
      if (req.body.skills) {
        if (user.skills.indexOf(req.body.skills) === -1) {
          user.skills.push(req.body.skills)
        }
        else {
          throw new Error('Skill already exist')
        }

      }
      const updatedUser = await user.save()
      res.status(200).json({
        success: true,
        data: updatedUser,
      })
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user project
// @route   PUT /api/users/project
// @access  Private
const updateProjectDetail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    const projectTitle = req.body.projectTitle || user.project.projectTitle
    const projectDescription = req.body.projectDescription || user.project.projectDescription
    const projectLink = req.body.projectLink || user.project.projectLink

    const project = {
      projectTitle: projectTitle,
      projectDescription: projectDescription,
      projectLink: projectLink
    }
    user.project.push(project)
    const updatedUser = await user.save()
    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users/top
// @access  Public
const getTopDevelopers = asyncHandler(async (req, res) => {
  // sort in descending (-1) order by points
  const sort = { points: -1 }
  const users = await User.find({ isAdmin: { $nin: true } }).sort(sort)
  res.json(users)
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Follow to Specific User
// @route   Put /api/users/follow/:targetedUserId
// @access  Private
const updateFollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    //to update followers of target user
    if (user.followers.indexOf(req.user._id) === -1) { //to check if this follower not exists
      user.followers.push(req.user._id)
      user.followerCount = user.followerCount + 1
      await user.save()

      const targetUser = await User.findById(req.user._id)
      targetUser.followings.push(user)
      await targetUser.save()
      res.status(201).json({
        success: true,
        message: "followed successfully",
      })
    } else {
      await user.followers.pull(req.user._id) // removed
      user.followerCount = user.followerCount - 1
      await user.save()
      await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { followings: { _id: user._id } } })
      res.status(201).json({
        success: true,
        message: "unfollowed successfully",
      })
    }

  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Check follow status
// @route   Get /api/users/isfollow/:targetedUserId
// @access  Private
const isFollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    if (user.followers.indexOf(req.user._id) === -1) { //to check if this follower not exists
      res.json(false)
    } else {
      res.json(true)
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Check myFollowings
// @route   Get /api/users/myfollowings
// @access  Private
const myFollowings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  if (user) {
    res.json(user.followings)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc  Send Quote to another user
//@route  POST /api/users/message/:userId
//@access  Private
const sendQuote = asyncHandler(async (req, res) => {
  const { description } = req.body
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    const msgSender = await User.findById(req.user._id).select('-password')
    const notificationCount = user.notifications
    user.notifications = notificationCount + 1

    const message = {
      user: msgSender,
      description: description
    }
    user.messages.push(message)
    await user.save()
    res.status(201).json({ message: 'Message Sent' })
  }
  else {
    res.status(400)
    throw new Error('User not Found')
  }
})

//@desc  Send Quote to another user
//@route  PUT /api/users/notification
//@access  Private
const handleNotification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  if (user.notifications != 0) {
    user.notifications = 0
    user.save()
    res.json(user.notifications)
  }
  else {
    res.json(0)

  }

})

// @desc    Get users count by month
// @route   GET /api/users/count
// @access  Public
const userCountByMonth = asyncHandler(async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          $and: [
            {
              "createdAt": {
                $gte: new Date("2022-01-01")
              }
            },
            {
              "createdAt": {
                $lte: new Date("2023-12-31")
              }
            }
          ],

        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              "date": "$createdAt",
              "format": "%Y-%m",
            }
          },
          Count: {
            $sum: 1
          },
        }

      },
      { $sort: { _id: 1 } }
    ])

    res.status(201).json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(400).json({
      success: false
    })
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  updateProjectDetail,
  getUsers,
  getUserById,
  getTopDevelopers,
  updateFollow,
  isFollow,
  myFollowings,
  sendQuote,
  handleNotification,
  userCountByMonth
}
