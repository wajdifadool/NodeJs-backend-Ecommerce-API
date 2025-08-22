const request = require('supertest')
const app = require('../app')
const { json } = require('express')

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
  const user = await request(app).post('/api/v1/auth/me').set('Authorization', `Bearer ${token}`).send({
    email,
    password,
  })

  return { user, token }
}

exports.createProduct = async (password = 'pass1234') => {
  const login = await request(app).post('/api/v1/auth/register').send({
    name: 'Admin Test',
    email: 'admin@example.com',
    role: 'admin',
    password,
  })

  const token = login.body.token

  const res = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${token}`).send({
    title: 'Food Product 1  ',
    description: 'optianl description',
    price: 10,
    stock: 12,
    categoryId: '6894b79fe9cb2fc816b18bfc',
  })
  return res.body.data
}
