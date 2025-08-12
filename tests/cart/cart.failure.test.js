const request = require('supertest')
const app = require('../../app')
const Cart = require('../../models/Cart')
const { registerAndGetUser } = require('../testUtils')

describe('Cart API - Failure Scenarios', () => {
  const cart_end_point = '/api/v1/carts'
  let user1, token1, user2, token2

  beforeAll(async () => {
    // Register two users
    const u1 = await registerAndGetUser('user1@example.com')
    const u2 = await registerAndGetUser('user2@example.com')
    user1 = u1.user
    token1 = u1.token
    user2 = u2.user
    token2 = u2.token
  })

  afterEach(async () => {
    await Cart.deleteMany()
  })

  // --- CREATE ---
  it('should not allow creating a second cart for same user', async () => {
    const body = {
      user: user1,
      items: [{ productId: '689727fab67af12096060d34', quantity: 2 }],
    }

    // Create cart once
    await request(app)
      .post(cart_end_point)
      .set('Authorization', `Bearer ${token1}`)
      .send(body)

    // Try to create again
    const res = await request(app)
      .post(cart_end_point)
      .set('Authorization', `Bearer ${token1}`)
      .send(body)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Cart already exists/i)
  })

  it('should not allow creating a cart without items', async () => {
    const res = await request(app)
      .post(cart_end_point)
      .set('Authorization', `Bearer ${token1}`)
      .send({ user: user1 })

    expect(res.statusCode).toBe(500) // or 422 if you validate schema
  })

  it('should not allow creating a cart without auth token', async () => {
    const res = await request(app)
      .post(cart_end_point)
      .send({
        items: [{ productId: '689727fab67af12096060d34', quantity: 2 }],
      })

    expect(res.statusCode).toBe(401)
  })

  // --- GET ---
  //   it("should not allow unauthorized user to access another user's cart", async () => {
  //     const cart = await Cart.create({
  //       userId: user1._id,
  //       user: user1,
  //       items: [{ productId: '689727fab67af12096060d34', quantity: 1 }],
  //     })

  //     const res = await request(app)
  //       .get(`${cart_end_point}/${cart._id}`)
  //       .set('Authorization', `Bearer ${token2}`)

  //     expect(res.statusCode).toBe(403)
  //     expect(res.body.message).toMatch(/Not authorized/i)
  //   })

  //   it('should return 404 for non-existing cart', async () => {
  //     const nonExistingId = '64f733adf30b3e5c4a5a8888' // valid ObjectId, not in DB

  //     const res = await request(app)
  //       .get(`${cart_end_point}/${nonExistingId}`)
  //       .set('Authorization', `Bearer ${token1}`)

  //     expect(res.statusCode).toBe(404)
  //     expect(res.body.message).toMatch(/not found/i)
  //   })

  //   it('should return 400 for invalid cartId format', async () => {
  //     const res = await request(app)
  //       .get(`${cart_end_point}/invalid-id`)
  //       .set('Authorization', `Bearer ${token1}`)

  //     expect(res.statusCode).toBe(400)
  //   })

  //   // --- UPDATE ---
  //   it('should not allow unauthorized update', async () => {
  //     const cart = await Cart.create({
  //       userId: user1._id,
  //       user: user1,
  //       items: [{ productId: '689727fab67af12096060d34', quantity: 1 }],
  //     })

  //     const res = await request(app)
  //       .put(`${cart_end_point}/${cart._id}`)
  //       .set('Authorization', `Bearer ${token2}`)
  //       .send({
  //         items: [{ productId: '689727fab67af12096060d34', quantity: 99 }],
  //       })

  //     expect(res.statusCode).toBe(403)
  //   })

  //   it('should not allow updating with invalid cartId', async () => {
  //     const res = await request(app)
  //       .put(`${cart_end_point}/bad-id`)
  //       .set('Authorization', `Bearer ${token1}`)
  //       .send({
  //         items: [{ productId: '689727fab67af12096060d34', quantity: 99 }],
  //       })

  //     expect(res.statusCode).toBe(400)
  //   })

  //   it('should not allow updating non-existing cart', async () => {
  //     const res = await request(app)
  //       .put(`${cart_end_point}/64f733adf30b3e5c4a5a8888`)
  //       .set('Authorization', `Bearer ${token1}`)
  //       .send({
  //         items: [{ productId: '689727fab67af12096060d34', quantity: 99 }],
  //       })

  //     expect(res.statusCode).toBe(404)
  //   })

  //   // --- DELETE ---
  //   it('should not allow unauthorized delete', async () => {
  //     const body = {
  //       user: user,
  //       items: [
  //         {
  //           productId: '689727fab67af12096060d34',
  //           quantity: 2,
  //         },
  //       ],
  //     }
  //     const cart = await request(app)
  //       .post(`${cart_end_point}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(body)

  //     // const cart = await Cart.create({
  //     //   //   userId: user1._id,
  //     //   user: user1,
  //     //   items: [{ productId: '689727fab67af12096060d34', quantity: 1 }],
  //     // })

  //     const _id = cart.body.data._id
  //     const res = await request(app)
  //       .delete(`${cart_end_point}/${_id}`)
  //       .set('Authorization', `Bearer ${token2}`)

  //     expect(res.statusCode).toBe(403)
  //   })

  //   it('should return 404 when deleting non-existing cart', async () => {
  //     const res = await request(app)
  //       .delete(`${cart_end_point}/64f733adf30b3e5c4a5a8888`)
  //       .set('Authorization', `Bearer ${token1}`)

  //     expect(res.statusCode).toBe(404)
  //   })

  //   it('should return 404 when deleting with invalid cartId', async () => {
  //     const res = await request(app)
  //       .delete(`${cart_end_point}/invalid-cart-id`)
  //       .set('Authorization', `Bearer ${token1}`)

  //     expect(res.statusCode).toBe(404)
  //   })
})
