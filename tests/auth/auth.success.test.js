const request = require('supertest')

const app = require('../../app') // NOT server.js
const mongoose = require('mongoose')
const User = require('../../models/User')

describe('Auth API', () => {
  afterEach(async () => {
    await User.deleteMany() // Clean up users after each test
  })

  // =================================================
  // ===========      Success Scenarios   ============
  // =================================================

  it('should register a user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Jest Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
  })

  it('should login a user', async () => {
    // First, register
    await request(app).post('/api/v1/auth/register').send({
      name: 'Jest Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    // Then login
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
  })

  it('should get current user (GET /me)', async () => {
    // Register User
    const reg = await request(app).post('/api/v1/auth/register').send({
      name: 'Jest User',
      email: 'me@example.com',
      password: 'password123',
    })

    const token = reg.body.token

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.email).toBe('me@example.com')
  })
})
