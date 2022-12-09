import asyncHandler from 'express-async-handler'
import Answer from '../models/answerModel.js'
import Question from '../models/questionModel.js'
import User from '../models/userModel.js'

import pkg from 'mongoose'
const { ObjectID } = pkg //try to check the equality of 2 objects

//@desc  Post answer
//@route  POST /api/answers
//@access  Private
const postAnswer = asyncHandler(async (req, res) => {
    const { questionId, description } = req.body
    const existingAnswer = await Answer.find({ questionId: questionId, userId: req.user._id })
    if (existingAnswer == "") {
        const { title } = await Question.findById(questionId)
        const answer = await Answer.create({
            userId: req.user._id,
            userName: req.user.name,
            userImage: req.user.image,
            questionId,
            questionTitle: title,
            description,
        })
        if (answer) {
            const answerCount = await Answer.find({ userId: req.user._id }).count()
            const targetedUser = await User.findById(req.user._id).select('-password')
            targetedUser.answerCount = answerCount
            await targetedUser.save()

            res.status(201).json({
                _id: answer._id,
                userId: req.user._id,
                userName: req.user.name,
                userImage: req.user.image,
                questionId: answer.questionId,
                questionTitle: title,
                description: answer.description,
            })


        } else {
            res.status(400)
            throw new Error('Invalid answer data')
        }

    }
    else {
        res.status(400)
        throw new Error('You are allowed to post answer only one time!')
    }

})

// @desc    Get answers by question ID
// @route   GET /api/answers/:id
// @access  Public
const getAnswerByQuestionId = asyncHandler(async (req, res) => {
    const answers = await Answer.find({ questionId: req.params.id })
    if (answers) {
        res.json(answers)
    } else {
        res.status(404)
        throw new Error('Answer not found')
    }
})

// @desc    Get all answers
// @route   GET /api/answers
// @access  Private
const getAnswers = asyncHandler(async (req, res) => {
    const answers = await Answer.find({})
    res.json(answers)
})

// @desc    Get logged in user answers
// @route   GET /api/answers/myanswers
// @access  Private
const getMyAnswers = asyncHandler(async (req, res) => {
    const myanswers = await Answer.find({ userId: req.user._id })
    if (myanswers) {
        res.json(myanswers)
    } else {
        res.status(404)
        throw new Error('Answers not found')
    }
})

//@desc  Post comments
//@route  POST /api/answers/:id/comment
//@access  Private
const postComment = asyncHandler(async (req, res) => {
    const { description } = req.body
    const answer = await Answer.findById(req.params.id)
    if (answer) {
        //const answer = await Answer;
        const comment = {
            user: req.user._id,
            userName: req.user.name,
            userImage: req.user.image,
            description: description,
            createdAt: Date.now()
        }
        answer.comments.push(comment)
        await answer.save()
        res.status(201).json({ message: 'Comment added' })
    } else {
        res.status(400)
        throw new Error('Invalid comment data')
    }
})

// @desc    Update vote
// @route   PUT /api/answers/vote
// @access  Private
const updateVote = asyncHandler(async (req, res) => {
    const { answerId } = req.body

    const answer = await Answer.findById(answerId)

    if (answer) {
        const existingVote = await Answer.find({ voteUp: { $elemMatch: { questionId: answer.questionId, user: req.user._id } } })
        if (existingVote == "") {
            const getAnswer = await Answer.findById(answerId)
            const question = await Question.findById(getAnswer.questionId)
            let validVoter = question.userId
            //let validUser = answer.voteUp.findIndex(obj => obj.user.equals(question.userId));
            if (validVoter.equals(req.user._id)) {
                const vote = {
                    questionId: answer.questionId,
                    answerId: answerId,
                    user: req.user._id,
                }
                answer.voteUp.push(vote)
                answer.voteCount = ++answer.voteCount
                await answer.save()

                question.voted = true
                await question.save()
                //update user points
                const getAnswer = await Answer.findById(answerId)
                let targetedUserId = getAnswer.userId
                const targetedUserDetail = await User.findById(targetedUserId)
                if (targetedUserDetail) {
                    targetedUserDetail.points = ++targetedUserDetail.points
                    let date = Date.now()
                    targetedUserDetail.updatedAt = date
                    await targetedUserDetail.save()
                }
                else {
                    res.status(404)
                    throw new Error('Something went wront!')
                }
                res.status(201).json({ message: 'Vote added' })
            }
            else {
                res.status(404)
                throw new Error('You are not allowed to vote!')
            }
        }
        else {
            res.status(404)
            throw new Error('Your vote is alreay exists!')
            // const existingVote = await Answer.findOneAndUpdate({ voteUp: {$elemMatch:{user: req.user._id, status: true}}},{
            //     $set: {
            //     //     let objIndex = answer.voteUp.findIndex(obj => obj.user.equals(req.user._id));
            //     //    voteUp.status = false;
            //         voteUp: {user: req.user._id,  status: false}         
            //     }
            // })
        }

    } else {
        res.status(404)
        throw new Error('Answer not found')
    }
})

// @desc    Get answer count by user ID
// @route   GET /api/answers/count/:userId
// @access  Public
const answerCountByUserId = asyncHandler(async (req, res) => {
    const getUserId = req.params.id
    let answerCount
    if (getUserId != "") {
        answerCount = await Answer.find({ userId: req.params.id }).count()
        if (answerCount) {
            res.json(answerCount)
        } else {
            res.json(0)
        }
    }
    else {
        res.status(404)
        throw new Error('Answer not found')
    }
})

export {
    postAnswer,
    getAnswerByQuestionId,
    getAnswers,
    getMyAnswers,
    postComment,
    updateVote,
    answerCountByUserId
}