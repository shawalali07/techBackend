import express from 'express'
const router = express.Router()
import { postQuestion, getQuestions, getMyQuestions, voteStatus, getQuestionById } from '../controllers/questionController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, postQuestion).get(getQuestions)
router.route('/myquestions').get(protect, getMyQuestions)
router.route('/:id').get(getQuestionById)
router.route('/status/canvote').post(protect, voteStatus)

export default router