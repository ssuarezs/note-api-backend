const supertest = require('supertest')
const app = require('../app')

const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Learning FullStack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Follow the course',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return { 
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  getAllContentFromNotes,
  getUsers,
  api
}
