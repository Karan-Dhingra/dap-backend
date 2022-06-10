const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    updateProfile,
    participateEvent,
} = require('../controller/userController')

router.post('/change-profile-pic', cors(), updateProfile)
router.post('/participate-event', cors(), participateEvent)

module.exports = router
