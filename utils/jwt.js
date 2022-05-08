const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {})
    return token
}

const createLimitedTimeToken = ({ payload, expiresIn }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    })
    return token
}

const isTokenValid = (token) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) return false
        return data
    })

module.exports = {
    createJWT,
    isTokenValid,
    createLimitedTimeToken,
}
