import pkg from 'mongoose'
const { Schema, model } = pkg

const snippetSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Snippet = model('Snippet', snippetSchema)

export default Snippet
