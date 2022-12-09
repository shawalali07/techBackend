import express from 'express'
const router = express.Router()
import { postKnowledge, getKnowledge, getMyKnowledge, getKnowledgeByUserId, getKnowledgeById, getKnowledgeByQuery, knowledgeCountByUserId } from '../controllers/knowledgeController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, postKnowledge)
router.route('/').get(getKnowledge)
router.route('/query/').get(getKnowledgeByQuery)
router.route('/myknowledge/').get(protect, getMyKnowledge)
router.route('/:id').get(getKnowledgeById)
router.route('/user/:id').get(getKnowledgeByUserId)
router.route('/count/user/:id').get(knowledgeCountByUserId)


export default router