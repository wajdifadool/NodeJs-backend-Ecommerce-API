const request = require('supertest')
const app = require('../../app') // your Express app, NOT server.js
const mongoose = require('mongoose')
const Category = require('../../models/Category')
const { registerAndLogin } = require('../testUtils')

describe('Category API - Success Scenarios', () => {
  const category_end_point = '/api/v1/category'

  afterEach(async () => {
    await Category.deleteMany() // Clean up categories after each test
  })

  it('should create a new category successfully', async () => {
    const token = await registerAndLogin('admin@example.com')

    const res = await request(app)
      .post(`${category_end_point}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Category',
        description: 'A test category',
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('_id')
    expect(res.body.data.name).toBe('New Category')
    expect(res.body.data).toHaveProperty('slug') // slug generated automatically
  })

  it('should get a category by id', async () => {
    const category = await Category.create({
      name: 'Existing Category',
      description: 'Description here',
    })

    const res = await request(app).get(`${category_end_point}/${category._id}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data._id).toBe(category._id.toString())
    expect(res.body.data.name).toBe('Existing Category')
  })

  it('should get all categories', async () => {
    // await Category.insertMany([
    //   { name: 'Category 1', description: 'Desc 1' },
    //   { name: 'Category 2', description: 'Desc 2' },
    // ])

    await Category.create({
      name: 'Category 1 ',
      description: 'Description here',
    })

    await Category.create({
      name: 'Category 2',
      description: 'Description here',
    })

    const res = await request(app).get(`${category_end_point}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.count).toBe(2)
    expect(res.body.data.length).toBe(2)
  })

  it('should update a category successfully', async () => {
    const token = await registerAndLogin('admin@example.com')
    const category = await Category.create({
      name: 'Old Category',
      description: 'Old Description',
    })

    const res = await request(app)
      .put(`${category_end_point}/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Category',
        description: 'Updated Description',
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Updated Category')
    expect(res.body.data.description).toBe('Updated Description')
    expect(res.body.data.slug).toBe('updated-category') // slug updated as well
  })

  it('should delete a category successfully', async () => {
    const token = await registerAndLogin('admin@example.com')
    const category = await Category.create({
      name: 'Category to Delete',
      description: 'To be deleted',
    })

    const res = await request(app)
      .delete(`${category_end_point}/${category._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/deleted successfully/i)

    // Confirm category is deleted from DB
    const deleted = await Category.findById(category._id)
    expect(deleted).toBeNull()
  })
})
