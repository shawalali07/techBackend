import asyncHandler from 'express-async-handler'
import Question from '../models/questionModel.js'

//@desc  Post question
//@route  POST /api/questions
//@access  Private
const postQuestion = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body
    const canVote = true

    const question = await Question.create({
        userId: req.user._id,
        userName: req.user.name,
        userImage: req.user.image,
        title,
        description,
        tags,
        canVote
    })

    if (question) {
        res.status(201).json({
            _id: question._id,
            userId: req.user._id,
            userName: req.user.name,
            userImage: req.user.image,
            title: question.title,
            description: question.description,
            tags: question.tags,
        })
    } else {
        res.status(400)
        throw new Error('Invalid question data')
    }
})

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
const getQuestions = asyncHandler(async (req, res) => {
    const quesions = await Question.find({})
    res.json(quesions)
})

// @desc    Get logged in user questions
// @route   GET /api/questions/myquestions
// @access  Private
const getMyQuestions = asyncHandler(async (req, res) => {
    const myquestions = await Question.find({ userId: req.user._id })
    if (myquestions) {
        res.json(myquestions)
    } else {
        res.status(404)
        throw new Error('Questions not found')
    }
})

// @desc    Get answers by id
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id)
    if (question) {
        res.json(question)
    } else {
        res.status(404)
        throw new Error('Question not found')
    }
})

// @desc    Get logged in user questions
// @route   POST /api/questions/canvote
// @access  Private
const voteStatus = asyncHandler(async (req, res) => {
    const { questionId } = req.body
    const question = await Question.findById(questionId)
    if (question) {
        let validVoter = question.userId
        if (validVoter.equals(req.user._id)) {
            res.json(true)
        }
        else {
            res.json(false)
        }
    }
    else {
        res.status(404)
        throw new Error('Question not found')
    }
})

export {
    postQuestion,
    getQuestions,
    getMyQuestions,
    getQuestionById,
    voteStatus
}