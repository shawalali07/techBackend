import pkg from 'mongoose'
const { Schema, model } = pkg

const questionSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    canVote: {
        type: Boolean,
        required: true,
    },
    voted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    })

const Question = model('Question', questionSchema)

export default Question