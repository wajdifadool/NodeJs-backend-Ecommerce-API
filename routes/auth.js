const express = require('express')

const { protect } = require('../middleware/auth')
const { registerUser, loginUser, getMe, logout, updateDetails, updatePassword } = require('../controllers/auth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/logout', protect, logout)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
module.exports = router
