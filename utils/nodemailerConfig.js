require('dotenv').config()

module.exports = {
    service: 'gmail',
    // host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER || 'vipersharma.88@gmail.com',
        pass: process.env.MAIL_PASS || 'ounvtgftnkymuzae',
    },
}
