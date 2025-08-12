const request = require('supertest')
const app = require('../../app') // your Express app, NOT server.js

const Cart = require('../../models/Cart')
const { registerAndGetUser } = require('../testUtils')

describe('Cart API - Success Scenarios', () => {
  const cart_end_point = '/api/v1/carts'

  afterEach(async () => {
    await Cart.deleteMany() // Clean up cart after each test
  })

  it('should create a new cart successfully', async () => {
    const { user, token } = await registerAndGetUser('user@example.com')

    const body = {
      user: user,
      items: [
        {
          productId: '689727fab67af12096060d34',
          quantity: 2,
        },
      ],
    }
    const res = await request(app)
      .post(`${cart_end_point}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('_id')
  })

  it('should update existing cart successfully ', async () => {
    const { user, token } = await registerAndGetUser('user1@example.com')
    const body = {
      user: user,
      items: [
        {
          productId: '689727fab67af12096060d34',
          quantity: 2,
        },
      ],
    }

    const res = await request(app)
      .post(`${cart_end_point}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)

    // Update
    const _id = res.body.data._id
    const body_update = {
      items: [
        {
          productId: '689727fab67af12096060d34',
          quantity: 10,
        },
      ],
    }

    const updateRes = await request(app)
      .put(`${cart_end_point}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body_update)

    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.success).toBe(true)
    expect(updateRes.body.data).toHaveProperty('_id')
    expect(updateRes.body.data.items[0].quantity).toBe(10)
  })

  it('should delete a cart successfully', async () => {
    const { user, token } = await registerAndGetUser('user1@example.com')
    const body = {
      user: user,
      items: [
        {
          productId: '689727fab67af12096060d34',
          quantity: 2,
        },
      ],
    }

    let res = await request(app)
      .post(`${cart_end_point}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)

    const _id = res.body.data._id

    res = await request(app)
      .delete(`${cart_end_point}/${_id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/deleted successfully/i)

    // Confirm category is deleted from DB
    const deleted = await Cart.findById(_id)
    expect(deleted).toBeNull()
  })
})
