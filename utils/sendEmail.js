const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(nodemailerConfig)
    // console.log(`Send Email: Transporter: ${transporter}`)
    return transporter.sendMail({
        from: 'karandhingra.contact@gmail.com', // sender address
        to,
        subject,
        html,
    })
}

module.exports = sendEmail
