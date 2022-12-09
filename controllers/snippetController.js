import asyncHandler from 'express-async-handler'
import Snippet from '../models/snippetModel.js'

export const createSnippet = asyncHandler(async (req, res) => {
  try {
    const snippet = await Snippet.create(req.body)
    res.status(201).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
    })
  }
})

export const fetchSnippets = asyncHandler(async (req, res) => {
  try {
    const snippet = await Snippet.find()
    res.status(200).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
    })
  }
})

export const updateSnippet = asyncHandler(async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)

    snippet.title = req.body.title || snippet.title
    snippet.description = req.body.description || snippet.description
    snippet.code = req.body.code || snippet.code
    snippet.tag = req.body.tag || snippet.tag
    await snippet.save()

    res.status(201).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
    })
  }
})

export const deleteSnippet = asyncHandler(async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    await snippet.remove()

    res.status(201).json({
      success: true,
      message: "snippet removed",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
    })
  }
})