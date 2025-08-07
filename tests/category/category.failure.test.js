const request = require('supertest')

const app = require('../../app') // NOT server.js
const mongoose = require('mongoose')
const Category = require('../../models/Category')
const { registerAndLogin } = require('../testUtils')

describe('Category API', () => {
  const category_end_point = '/api/v1/category'
  afterEach(async () => {
    await Category.deleteMany() // Clean up categories after each test
  })

  // =================================================
  // ===========      Fail Scenarios      ============
  // =================================================

  it('should fail to Create Category with no user token', async () => {
    const res = await request(app).post(`${category_end_point}`).send({
      title: 'some title',
    })

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toMatch(/Not authorized to access this route/i)
    // Not authorized to access this route
  })

  it('should fail to Crreate with missing fields', async () => {
    const token = await registerAndLogin('admin@example.com')

    const res = await request(app)
      .post(`${category_end_point}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})

    // const res = await request(app).post(`${category_end_point}`).send({
    //   // Missing Title + description
    // })

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBeDefined()
  })

  it('should fail to Create duplicate category title', async () => {
    const token = await registerAndLogin('admin@example.com')

    let res = await request(app)
      .post(`${category_end_point}`)
      .set('Authorization', `Bearer ${token}`)

      .send({
        name: 'Category Duplication',
      })

    res = await request(app)
      .post(`${category_end_point}`)
      .set('Authorization', `Bearer ${token}`)

      .send({
        name: 'Category Duplication',
      })

    expect(res.statusCode).toBe(409)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBeDefined()
    // expect(res.body.error).toMatch('Email already registered')
  })
})
