const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    updateProfile,
    participateEvent,
    userInfo,
    getDiscord,
} = require('../controller/userController')

router.post('/change-profile-pic', cors(), updateProfile)
router.post('/participate-event', cors(), participateEvent)
router.post('/info', cors(), userInfo)
router.get('/discord/roles', cors(), getDiscord)

module.exports = router
