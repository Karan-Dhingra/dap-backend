const { isTokenValid } = require('../utils')
const Token = require('../models/Token')

const authenticateUser = async (req, res, next) => {
    try {
        // console.log('AUTHENTICATING...')
        const accessToken = req.headers['authorization']
        const bearerToken = accessToken.split(' ')[1]
        if (accessToken) {
            const payload = isTokenValid(bearerToken)
            if (!payload) {
                return res.status(401).json({ msg: 'Invalid Token' })
            }

            req.user = payload
            // console.log('authenticate')

            return next()
        } else {
            console.log('authentication failed')

            return res.status(500).json({ error: 'Invalid Token' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Authentication Invalid')
    }
}

module.exports = { authenticateUser }
