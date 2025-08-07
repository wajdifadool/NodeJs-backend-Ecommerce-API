const express = require('express')
const { getSample, setSample } = require('../controllers/sample')
const router = express.Router()

router.get('/', getSample)
router.post('/', setSample)

module.exports = router
