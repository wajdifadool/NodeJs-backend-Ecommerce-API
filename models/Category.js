const mongoose = require('mongoose')
const slugify = require('slugify')
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  description: { type: String },
})

//https://mongoosejs.com/docs/middleware.html#types-of-middleware
// Create Bootcamp Slug from the name
// will run before the documnet get saved, (note on the updated tirck)
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // ensures the slug is only regenerated if the name actually changes.

    // we can accses any field using this.
    this.slug = slugify(this.name, { lower: true })
  }
  next() // so it can continue to the next function (creating the object)
})

module.exports = mongoose.model('Category', categorySchema)
