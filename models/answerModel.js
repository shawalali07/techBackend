import pkg from 'mongoose'
const { Schema, model } = pkg

const commentSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
    })

const answerSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    questionTitle: {
        type: String,
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
    },
    voteUp: {
        type: Array,
        status: { type: Boolean },
        question: { type: Schema.Types.ObjectId, ref: 'Question' },
        answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
        votedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    voteCount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [commentSchema],
},
    {
        timestamps: true,
    })

const Answer = model('Answer', answerSchema)

export default Answer