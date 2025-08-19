const express = require('express')

const { protect } = require('../middleware/auth')
const { registerUser, loginUser, getMe } = require('../controllers/auth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router
