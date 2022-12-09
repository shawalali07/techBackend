import pkg from 'mongoose'
const { Schema, model } = pkg

const knowledgeSchema = Schema({
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
},
    {
        timestamps: true,
    })

const Knowledge = model('Knowledge', knowledgeSchema)

export default Knowledge