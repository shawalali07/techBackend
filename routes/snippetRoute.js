import express from 'express'
const router = express.Router()
import {
  createSnippet,
  fetchSnippets,
  updateSnippet,
  deleteSnippet,
} from '../controllers/snippetController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, admin, createSnippet).get(fetchSnippets)
router.route('/:id').put(protect, admin, updateSnippet).delete(protect, admin, deleteSnippet)

export default router
