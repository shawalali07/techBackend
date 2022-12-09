import asyncHandler from 'express-async-handler'
import Knowledge from '../models/knowledgeModel.js'

//@desc  Post knowledge
//@route  POST /api/knowledge
//@access  Private
const postKnowledge = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body

    const knowledge = await Knowledge.create({
        userId: req.user._id,
        userName: req.user.name,
        userImage: req.user.image,
        title,
        description,
        tags,
    })

    if (knowledge) {
        res.status(201).json({
            _id: knowledge._id,
            userId: req.user._id,
            userName: req.user.name,
            userImage: req.user.image,
            title: knowledge.title,
            description: knowledge.description,
            tags: knowledge.tags,
        })
    } else {
        res.status(400)
        throw new Error('Invalid knowledge data')
    }
})

// @desc    Get all knowledge
// @route   GET /api/knowledge
// @access  Private
const getKnowledge = asyncHandler(async (req, res) => {
    const knowledge = await Knowledge.find({})
    res.json(knowledge)
})

// @desc    Get knowledge by query
// @route   GET /api/knowledge/query/
// @access  Public
const getKnowledgeByQuery = asyncHandler(async (req, res) => {
    // const knowledge = await Knowledge.find({})
    // res.json(knowledge)

    //const { pageNumber } = useParams() || "" 
    //const query = req.query || ""
    //search functionality
    let knowledge
    const queryUserName = req.query.queryUserName || ""
    const queryTag = req.query.queryTag || ""

    if (queryUserName != "" && queryTag == "") {
        knowledge = await Knowledge.find({ userName: queryUserName })
    }
    else if (queryTag != "" && queryUserName == "") {
        knowledge = await Knowledge.find({ tags: queryTag })
    }
    else if (queryTag != "" && queryUserName != "") {
        knowledge = await Knowledge.find({ userName: queryUserName, tags: queryTag })
    }
    else {
        knowledge = await Knowledge.find({})
    }

    res.json({ knowledge })
})

// @desc    Get knowledge by id
// @route   GET /api/knowledge/:id
// @access  Public
const getKnowledgeById = asyncHandler(async (req, res) => {
    const knowledge = await Knowledge.findById(req.params.id)
    if (knowledge) {
        res.json(knowledge)
    } else {
        res.status(404)
        throw new Error('Knowledge not found')
    }
})


// @desc    Get logged in user knowledge
// @route   GET /api/knowledge/myknowledge
// @access  Private
const getMyKnowledge = asyncHandler(async (req, res) => {
    const myknowledge = await Knowledge.find({ userId: req.user._id })
    if (myknowledge) {
        res.json(myknowledge)
    } else {
        res.status(404)
        throw new Error('Knowledge not found')
    }
})

// @desc    Get answers by question ID
// @route   GET /api/knowledge/user/:userId
// @access  Public
const getKnowledgeByUserId = asyncHandler(async (req, res) => {
    const getUserId = req.params.id
    const queryTag = req.query.queryTag || ""
    let knowledge
    if (getUserId != "" && queryTag == "") {
        knowledge = await Knowledge.find({ userId: req.params.id })
    }
    else if (queryTag != "" && getUserId != "") {
        knowledge = await Knowledge.find({ userId: req.params.id, tags: queryTag })
    }
    if (knowledge) {
        res.json(knowledge)
    } else {
        res.status(404)
        throw new Error('Knowledge not found')
    }
})

// @desc    Get knowledge count by user ID
// @route   GET /api/knowledge/count/user/:userId
// @access  Public
const knowledgeCountByUserId = asyncHandler(async (req, res) => {
    const getUserId = req.params.id
    let knowledge
    if (getUserId != "") {
        knowledge = await Knowledge.find({ userId: req.params.id }).count()
        if (knowledge) {
            res.json(knowledge)
        } else {
            res.json(0)
        }
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    postKnowledge,
    getKnowledge,
    getKnowledgeByQuery,
    getMyKnowledge,
    getKnowledgeById,
    getKnowledgeByUserId,
    knowledgeCountByUserId
}