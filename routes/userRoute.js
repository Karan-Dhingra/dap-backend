const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    ChangePassword,
    updateProfile,
} = require('../controller/userController')

router.post('/change-password', cors(), ChangePassword)
router.post('/change-profile-pic', cors(), updateProfile)

module.exports = router
