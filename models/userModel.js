import pkg from 'mongoose'
const { Schema, model } = pkg

import bcrypt from 'bcryptjs'

const messageSchema = Schema({
    user: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        required: true
    },

},
    {
        timestamps: true,
    })

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: String,
        required: true,
        default: false
    },
    isCompany: {
        type: String,
        default: false
    },
    image: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        default: 0
    },
    followerCount: {
        type: Number,
        default: 0
    },
    followers: {
        type: Array,
    },
    followings: {
        type: Array,
    },
    aboutMe: {
        type: String,
        default: ''
    },
    designation: {
        type: String,
        default: ''
    },
    skills: {
        type: Array,
        default: []
    },
    country: {
        type: String,
        default: ''
    },
    rate: {
        type: Number,
        default: 0
    },
    messages: [messageSchema],
    notifications: {
        type: Number,
        default: 0
    },
    answerCount: {
        type: Number,
        default: 0
    },
    project: {
        type: Array,
        projectTitle: {
            type: String,
            default: ""
        },
        projectDescription: {
            type: String,
            default: ""
        },
        projectLink: {
            type: String,
            default: ""
        },
    }

},
    {
        timestamps: true,
    })

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = model('User', userSchema)

export default User