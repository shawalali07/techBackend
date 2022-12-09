import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  getTopDevelopers,
  updateUserProfile,
  getUsers,
  getUserById,
  updateFollow,
  sendQuote,
  handleNotification,
  isFollow,
  myFollowings,
  userCountByMonth,
  updateProjectDetail
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(getUsers)
router.route('/project').put(protect, updateProjectDetail)
router.get('/count', userCountByMonth)
router.route('/message/:id').post(protect, sendQuote)
router.route('/notification').put(protect, handleNotification)
router.route('/top').get(getTopDevelopers)
router.route('/follow/:id').put(protect, updateFollow)
router.route('/isfollow/:id').get(protect, isFollow)
router.route('/myfollowings').get(protect, myFollowings)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').get(getUserById)

export default router