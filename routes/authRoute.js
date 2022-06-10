const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    login,
    getAllSuperAdmin,
    getAllAdmin,
    changeUserStatus,
    setactivity,
    getactivity,
} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/login', cors(), login)
router.get('/getAllSuperAdmin', cors(), authenticateUser, getAllSuperAdmin)
router.get('/getAllAdmin', cors(), authenticateUser, getAllAdmin)
router.post('/changeUserStatus', cors(), authenticateUser, changeUserStatus)
router.post('/activity', cors(), setactivity)
router.post('/getactivity', cors(), getactivity)

module.exports = router
