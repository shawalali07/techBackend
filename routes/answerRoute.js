import express from 'express'
const router = express.Router()
import { postAnswer, getAnswerByQuestionId, getAnswers, postComment, updateVote, getMyAnswers, answerCountByUserId } from '../controllers/answerController.js'
import { protect } from '../middleware/authMiddleware.js'


router.route('/').post(protect, postAnswer).get(getAnswers)
router.route('/myanswers').get(protect, getMyAnswers)
router.route('/vote').put(protect, updateVote)
router.route('/:id/comment').post(protect, postComment)
router.route('/:id').get(getAnswerByQuestionId)
router.route('/count/:id').get(answerCountByUserId)
export default router