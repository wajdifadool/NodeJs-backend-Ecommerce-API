const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Routes
const sampleRoutes = require('./routes/sample')
const authRoutes = require('./routes/auth')
const productRoute = require('./routes/product')
const categoryRoute = require('./routes/category')
const cartRoute = require('./routes/cart')

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(morgan('dev'))
app.use('/api/v1/sample', sampleRoutes)

// Authintication Routes :
app.use('/api/v1/auth', authRoutes)
// Products Route
app.use('/api/v1/products', productRoute)
// Category Route
app.use('/api/v1/category', categoryRoute)
// Cart Route
app.use('/api/v1/carts', cartRoute)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
