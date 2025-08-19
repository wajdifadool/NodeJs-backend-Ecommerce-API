const mongoose = require('mongoose')
const Product = require('./Product')
const ErrorResponse = require('../utils/errorResponse')

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    cartId: String,

    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true, min: 1 },
          price: { type: Number, required: true },
          // TODO: add pirce , shiiping fee , tax
          //
        },
      ],
      required: true,
      validate: [(array) => array.length > 0, 'Cart must have at least one item.'],
    },

    subtotal: { type: Number, required: true, default: 0 },
    // tax: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },

    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],

      default: 'pending',
    },
  },
  { timestamps: true }
)

// Method to build order data from cart
orderSchema.statics.buildOrderFromCart = async function (cart) {
  if (!cart || !cart.items.length) {
    throw new ErrorResponse('Cart is empty', 400)
  }

  let orderItems = []
  let subtotal = 0

  for (const item of cart.items) {
    const product = await Product.findById(item.productId)

    if (!product) {
      throw new ErrorResponse(`Product ${item.productId} not found`, 404)
    }

    if (product.stock < item.quantity) {
      throw new ErrorResponse(`Insufficient stock for ${product.name}`, 400)
    }

    const itemTotal = product.price * item.quantity
    subtotal += itemTotal
    // TODO: handle tax + shipping fee
    orderItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    })
  }

  return { items: orderItems, subtotal }
}

module.exports = mongoose.model('Order', orderSchema)
