const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const {getUsers, api} = require('./helpers')

describe('creating a new user', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'gridroot', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: 'ssuarezs',
      name: 'Santiago',
      password: 'fullstackopen'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    const usernames = usersAtEnd.map(u => u.username)

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)
  })

  test('creating fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: 'gridroot',
      name: 'gridman',
      password: 'gridtest'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    console.log(result)
    const usersAtEnd = await getUsers()
    expect(result.body.error).toContain('`username` to be unique')
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
