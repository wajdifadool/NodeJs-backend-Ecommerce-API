const request = require('supertest')
const app = require('../../app')
const Cart = require('../../models/Cart')

const { registerAndGetUser, createProduct } = require('../testUtils')

describe('Cart API - Failure Scenarios', () => {
  const cart_end_point = '/api/v1/carts'

  afterEach(async () => {
    await Cart.deleteMany()
  })

  // --- CREATE ---
  it('should not allow creating a second cart for same user', async () => {
    const product = await createProduct()
    const { user, token } = await registerAndGetUser('user@example.com')

    const body = {
      user: user,
      items: [
        {
          productId: product._id,
          quantity: 2,
        },
      ],
    }
    const res = await request(app).post(`${cart_end_point}`).set('Authorization', `Bearer ${token}`).send(body)

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('_id')

    const res2 = await request(app).post(`${cart_end_point}`).set('Authorization', `Bearer ${token}`).send(body)

    expect(res2.statusCode).toBe(400)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message).toMatch(/Cart already exists/i)
  })

  it('should not allow creating a cart without items', async () => {
    const { user, token } = await registerAndGetUser('user@example.com')

    const body = {
      user: user,
    }
    const res = await request(app).post(`${cart_end_point}`).set('Authorization', `Bearer ${token}`).send(body)

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should not allow creating a cart without auth token', async () => {
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
    const res = await request(app).post(`${cart_end_point}`).send(body)

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })

  // // --- GET ---
  it("should not allow unauthorized user to access another user's cart", async () => {
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
    const res = await request(app).post(`${cart_end_point}`).set('Authorization', `Bearer ${token}`).send(body)

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('_id')

    const res1_id = res.body.data._id
    console.log(`res 1 id = ${res1_id}`)

    // Create the second User

    const { user: user2, token: token2 } = await registerAndGetUser('user2@example.com')

    const body_user_2 = {
      user: user2,
      items: [
        {
          productId: '689727fab67af12096060d34',
          quantity: 20,
        },
      ],
    }

    const res_user_2 = await request(app).get(`${cart_end_point}/${res1_id}`).set('Authorization', `Bearer ${token2}`).send(body_user_2)

    console.log(res_user_2.body)
    expect(res_user_2.statusCode).toBe(403)
    expect(res_user_2.body.success).toBe(false)
    expect(res_user_2.body.error).toMatch(/Not authorized to access this Cart/i)
  })

  it('should return 404 for non-existing cart', async () => {
    const nonExistingCartId = '64f733adf30b3e5c4a5a8888' // valid ObjectId, not in DB

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

    const res = await request(app).get(`${cart_end_point}/${nonExistingCartId}`).set('Authorization', `Bearer ${token}`).send(body)

    console.log(res.body)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toMatch(/not found/i)
  })

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
