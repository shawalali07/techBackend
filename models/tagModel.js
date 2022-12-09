import pkg from 'mongoose'
const { Schema, model } = pkg

const tagSchema = Schema(
  {
    tag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Tag = model('Tag', tagSchema)

export default Tag
