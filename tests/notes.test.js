const mongoose = require('mongoose')
const Note = require('../models/Note')

const {initialNotes, getAllContentFromNotes, getUsers, api} = require('./helpers')


beforeEach(async () => {
  await Note.deleteMany({})
  for (let note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET /api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('notes have the correspond length', async () => {
    const {contents, response} = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('note is about FullStack JS', async () => {
    const {contents, response} = await getAllContentFromNotes()
    expect(contents).toContain('Learning FullStack JS')
  })
  test('a determinate note can be obtained', async () => {
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const noteToGet = notes[0]

    await api
      .get(`/api/notes/${noteToGet.id}`)
      .expect(200)
  })
  test('a note that do not exist can not be obtained', async () => {
    await api
      .get(`/api/notes/6213a070453aa8a1fffb53da`)
      .expect(404)
  })
})

describe('POST /api/notes', () => {
  test('a valid note can be added', async () => {
    const users = await getUsers()
    const newNote = {
      content: 'Comming soon async/await',
      important: true,
      userId: users[0].id
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const {contents, response} = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length+1)
    expect(contents).toContain(newNote.content)
  })

  test('a note without content cannot be added', async () => {
    const users = await getUsers()
    const newNote = { important: true, userId: users[0].id }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const {contents, response} = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('PUT /api/notes', () => {
  test('a note can be updated', async () => {
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const noteToUpdate = notes[0]
    const newNote = {content: 'note updated', important: false}

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(newNote)
      .expect(200)

    const { contents, response: secondRes } = await getAllContentFromNotes()
    expect(secondRes.body).toHaveLength(initialNotes.length)
    expect(contents).not.toContain(noteToUpdate.content)
    expect(contents).toContain(newNote.content)
  })

  test('a note that do not exist can not be updated', async () => {
    const newNote = {content: 'note updated', important: false}

    await api
      .put(`/api/notes/6213a070453aa8a1fffb53da`)
      .send(newNote)
      .expect(200)

    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
    expect(contents).not.toContain(newNote.content)
  })
})

describe('DELETE /api/notes', () => {
  test('a note can be deleted', async () => {
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const noteToDelete = notes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondRes } = await getAllContentFromNotes()
    expect(secondRes.body).toHaveLength(initialNotes.length-1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete(`/api/notes/1234`)
      .expect(400)

    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})




afterAll(() => {
  mongoose.connection.close()
})
