const request = require('supertest')
const app = require('../app')

exports.registerAndLogin = async (email, password = 'pass1234') => {
  await request(app).post('/api/v1/auth/register').send({
    name: 'Admin Test User',
    email,
    role: 'admin',
    password,
  })

  const login = await request(app).post('/api/v1/auth/login').send({
    email,
    password,
  })
  return login.body.token
}

exports.registerAndGetUser = async (email, password = 'pass1234') => {
  const login = await request(app).post('/api/v1/auth/register').send({
    name: 'User Test',
    email,
    password,
  })

  const token = login.body.token
  const user = await request(app)
    .post('/api/v1/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send({
      email,
      password,
    })

  return { user, token }
}
