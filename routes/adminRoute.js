import express from 'express'

const router = express.Router()
import {
    authAdmin, updateUser, deleteUser, addTag, deleteTag, getTags
} from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.post('/login', authAdmin)
router.route('/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUser)
router.route('/tag').post(protect, admin, addTag).get(getTags)
router.route('/tag/:id').delete(protect, admin, deleteTag)

export default router