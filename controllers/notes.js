const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

const { userExtractor } = require('../utils/middleware')

notesRouter.get('/', async(request, response) => {
  const notes = await Note.find({})
    .populate('user', {
      username: 1,
      name: 1
    }) 
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if(note){
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    content, 
    important = false
  } = request.body

  const user = await User.findById(request.userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const note = new Note({
    content,
    important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  
  response.json(savedNote)
  
  next()
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndRemove(id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})

module.exports = notesRouter
