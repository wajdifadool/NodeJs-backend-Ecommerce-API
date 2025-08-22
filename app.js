// USED FOR TESTING
// app.js
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
// const errorHandler = require('./middleware/error')
const errorHandler = require('./middleware/errorHandler')

// Routes
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const cartRoute = require('./routes/cart')
const productRoute = require('./routes/product')

dotenv.config({ path: './config/config.env' })

const app = express()

app.use(express.json())
// if you also expect URL encoded forms
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(fileUpload())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/carts', cartRoute)
app.use('/api/v1/products', productRoute)

app.use(errorHandler)

module.exports = app
