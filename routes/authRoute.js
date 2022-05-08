const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getAllSuperAdmin,
    getAllAdmin,
    changeUserStatus,
    setactivity,
    getactivity,
} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/register', cors(), register)
router.post('/login', cors(), login)
router.post('/logout', cors(), authenticateUser, logout)
router.get('/verify-email', cors(), verifyEmail)
router.post('/reset-password', cors(), resetPassword)
router.post('/forgot-password', cors(), forgotPassword)
router.get('/getAllSuperAdmin', cors(), authenticateUser, getAllSuperAdmin)
router.get('/getAllAdmin', cors(), authenticateUser, getAllAdmin)
router.post('/changeUserStatus', cors(), authenticateUser, changeUserStatus)
router.post('/activity', cors(), setactivity)
router.post('/getactivity', cors(), getactivity)

module.exports = router
