require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const Note = require('./models/Note')

const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
	res.send('<h1>Welcome to Notes API</h1>')
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res, next) => {
	const { id } = req.params

	Note.findById(id)
		.then(note => {
			if(note) return	res.json(note)
			res.status(404).end()
		})
		.catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
	const { id } = req.params

	Note.findByIdAndDelete(id)
		.then(() => res.status(204).end())
		.catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
	const note = req.body

	if(!note || !note.content){
		return res.status(400).json({
			error: 'note.content is missing'
		})
	}

	const newNote = new Note({
		content: note.content,
		date: new Date().toISOString(),
		important: note.important || false
	})

	newNote.save()
		.then(savedNote => res.json(savedNote))
		.catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
	const note = request.body

	const newNoteInfo = {
		content: note.content,
		date: new Date().toISOString(),
		important: note.important || false
	}

	Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
		.then(result => {
			response.json(result)
		}).catch(err => next(err))
})


app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
