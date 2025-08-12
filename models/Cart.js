const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      required: true,
      validate: [
        (array) => array.length > 0,
        'Cart must have at least one item.',
      ],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
