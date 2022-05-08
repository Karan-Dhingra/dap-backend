const Token = require('../models/Token')
const models = require('../models/User')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const {
    createTokenPayload,
    createJWT,
    sendVerificationEmail,
    sendResetPassswordEmail,
    createHash,
    createWalletAddressPayload,
} = require('../utils')

// const register = async (req, res) => {
//     try {
//         const {
//             username,
//             email,
//             password,
//             confirmPassword,
//             metamaskKey,
//             isAdmin,
//         } = req.body
//         if (!email) {
//             res.status(401).json({ msg: 'Please provide an email' })
//         } else if (!username) {
//             res.status(401).json({ msg: 'Please provide the username' })
//         } else if (!password) {
//             res.status(401).json({ msg: 'Please provide the password' })
//         } else if (password !== confirmPassword) {
//             res.status(401).json({ msg: 'Password not match' })
//         }
//         const emailAlreadyExists = await models.users.findOne({
//             email: { $regex: new RegExp(email, 'i') },
//         })
//         if (emailAlreadyExists) {
//             res.status(401).json({ msg: 'Email already exists' })
//         }

//         const usernameAlreadyExists = await models.users.findOne({
//             username: { $regex: new RegExp(username, 'i') },
//         })
//         if (usernameAlreadyExists) {
//             res.status(500).json({ msg: 'Username already exists' })
//         }

//         hashedPassword = CryptoJS.AES.encrypt(
//             req.body.password,
//             process.env.PASS_SEC
//         ).toString()
//         const verificationToken = crypto.randomBytes(40).toString('hex')
//         let referralCode = await getReferralCode()
//         let createObj = {
//             username: username,
//             email: email,
//             password: hashedPassword,
//             metamaskKey: metamaskKey,
//             verificationToken: verificationToken,
//             isAdmin: isAdmin == 'True' ? true : false,
//             referralCode: referralCode.code,
//         }
//         const user = await models.users.create(createObj)
//         const origin = process.env.APP_BACKEND_URL
//         await sendVerificationEmail({
//             name: user.username,
//             email: user.email,
//             verificationToken: user.verificationToken,
//             origin,
//         })

//         res.status(201).json({
//             msg: 'Success! Please check your email to verify account',
//         })
//     } catch (err) {
//         console.log(err.msg)
//         res.status(400)
//         // throw new Error('Error Occured')
//     }
// }

const test = async (req, res) => {
    res.send('Server Running...')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || email === '') {
            res.status(401).json({ msg: 'Please provide an email.' })
            return
        } else if (!password || password === '') {
            res.status(401).json({ msg: 'Please enter the password' })
            return
        }

        const user = await models.users.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (!user) {
            res.status(401).json({ msg: `User doesn't exists` })
            return
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8)
        if (hashedPassword !== password) {
            res.status(401).json({ msg: 'Wrong Password!!' })
            return
        }

        // Following code will run and see if user has verified email // update model when you will use nodmailer

        if (!user.isVerified) {
            res.status(401).json({ msg: 'Please verify your email' })
        }

        const tokenUser = createTokenPayload(user)

        // check for existing token
        const existingToken = await Token.findOne({ user: user._id })

        if (existingToken) {
            await Token.findOneAndDelete({ user: user._id })
        }
        const token = createJWT({ payload: tokenUser })
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const userToken = { token, ip, userAgent, user: user._id }

        await Token.create(userToken)

        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
            profilePic: user.profilePic || '',
            accessToken: token,
            updatedAt: user.updatedAt,
        })
        return
    } catch (e) {
        console.log(e)
        res.status(400)
        // throw new Error('Invalid Credentials')
    }
}

const logout = async (req, res) => {
    try {
        await Token.findOneAndDelete({ user: req.user.userId })
        res.status(201).json({ msg: 'User logged out!' })
    } catch (e) {
        console.log('Error: ' + e.msg)
        res.status(500).json({ msg: e.msg })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.query.token
        const email = req.query.email

        if (verificationToken === '' || !verificationToken) {
            res.status(401).json({ msg: 'Invalid Credentials!' })
            return
        }

        if (email === '' || !email) {
            res.status(401).json({ msg: 'Invalid Credentials!' })
            return
        }

        const user = await models.users.findOne({ email })
        console.log('JK')
        if (user) {
            if (user.verificationToken === '') {
                res.status(401).json({ msg: 'User already verified' })
                return
            }

            if (user.verificationToken !== verificationToken) {
                res.status(401).json({ msg: 'Invalid verification token' })
                return
            }

            try {
                user.isVerified = true
                user.verifiedOn = Date.now()
                user.verificationToken = ''
                await user.save()
            } catch (err) {
                console.log(err.msg)
                res.status(501).json({ msg: err.msg })
            }

            res.status(201).json({ msg: 'Email Successfully Verified' })
        } else {
            res.status(401).json({ msg: 'Invalid Request' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.msg })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide valid email' })
        }

        const user = await models.users.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (user) {
            const passwordToken = crypto.randomBytes(70).toString('hex')
            // send email
            const origin = process.env.APP_BACKEND_URL
            await sendResetPassswordEmail({
                name: user.username,
                email: user.email,
                token: passwordToken,
                origin,
            })

            console.log(passwordToken)

            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpirationDate = new Date(
                Date.now() + tenMinutes
            )

            user.passwordToken = createHash(passwordToken)
            user.passwordTokenExpirationDate = passwordTokenExpirationDate
            await user.save()

            res.status(200).json({
                msg: 'Please check your email for reset password link',
            })
        } else {
            res.status(401).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.msg })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide an email' })
        } else if (!password) {
            res.status(401).json({ msg: 'Please provide the password' })
        } else if (!token) {
            res.status(401).json({ msg: 'Please provide the token' })
        }

        const user = await models.users.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (user) {
            const currentDate = new Date()
            console.log(createHash(token))
            if (
                !(
                    user.passwordToken === createHash(token) &&
                    user.passwordTokenExpirationDate > currentDate
                )
            ) {
                res.status(200).json({
                    msg: 'Invalid Token',
                })
            }
            let hashedPassword = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString()
            user.password = hashedPassword
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            await user.save()
            // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            res.status(200).json({
                msg: 'Password has been successfully updated',
            })
        } else {
            res.status(200).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        res.status(501).json({ msg: e.msg })
    }
}

const register = async function (req, res) {
    try {
        let keys = ['email', 'username', 'password']
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == '') {
                res.json({ status: 401, msg: keys[i] + ' are required' })
                return
            }
        }

        query = { email: req.body.email }
        const checkMail = await models.users.findOne(query)
        if (checkMail) {
            res.json({ status: 400, msg: 'Email already in use' })
        } else {
            query = { username: { $regex: new RegExp(req.body.username, 'i') } }
            const checkUserName = await models.users.findOne(query)
            if (checkUserName) {
                res.json({ status: 400, msg: 'Username already exists' })
            } else {
                const verificationToken = crypto.randomBytes(40).toString('hex')
                let hashedPassword = CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.PASS_SEC
                ).toString()
                query = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    verificationToken: verificationToken,
                    isAdmin:
                        req.body.isAdmin !== undefined &&
                        req.body.isAdmin == 'True'
                            ? true
                            : false,
                    isSuperAdmin:
                        req.body.isSuperAdmin !== undefined &&
                        req.body.isSuperAdmin == 'True'
                            ? true
                            : false,
                }
                const newUser = new models.users(query)
                const insertNewReferral = await newUser.save()
                if (insertNewReferral) {
                    const newUserInfo = await models.users.findById(
                        insertNewReferral._id
                    )
                    sendVerificationEmail({
                        name: newUserInfo.username,
                        email: newUserInfo.email,
                        verificationToken: newUserInfo.verificationToken,
                        origin: process.env.APP_BACKEND_URL,
                    })
                    if (newUserInfo) {
                        res.status(201).json({
                            msg: 'Success! Please check your email to verify account',
                        })
                    } else {
                        res.json({
                            status: 400,
                            msg: 'Something went Wrong',
                        })
                    }
                } else {
                    res.json({
                        status: 400,
                        msg: 'User not created. Please try again',
                    })
                }
            }
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllSuperAdmin = async function (req, res) {
    try {
        const superAdmin = await models.users.find({ isSuperAdmin: true })

        if (superAdmin && superAdmin.length) {
            res.json({ status: 200, msg: 'Success', data: superAdmin })
        } else {
            res.json({ status: 200, msg: 'No Super Admin Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllAdmin = async function (req, res) {
    try {
        const admin = await models.users.find({ isAdmin: true })

        if (admin && admin.length) {
            res.json({ status: 200, msg: 'Success', data: admin })
        } else {
            res.json({ status: 200, msg: 'No Admin Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const changeUserStatus = async function (req, res) {
    let userId
    if (req.body.email) {
        const userData = await models.users.findOne({
            email: { $regex: new RegExp(req.body.email, 'i') },
        })
        if (userData) {
            userId = userData._id
        } else {
            res.json({ status: 400, msg: 'User not found' })
            return
        }
    }
    try {
        if (req.body.status == undefined || req.body.status == 0) {
            res.json({ status: 400, msg: 'status is required' })
            return
        }

        if (userId == undefined || userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        // Status -> 11 [Add Admin]
        // Status -> 12 [Delete Admin]
        // Status -> 21 [Add Super Admin]
        // Status -> 22 [Delete Super Admin]

        const userInfo = await models.users.find({ _id: userId })
        console.log(userInfo)
        // if (userInfo.isAdmin && req.body.status === 11) {
        //     res.json({ status: 400, msg: 'User is already Admin' })
        //     return
        // } else if (!userInfo.isAdmin && req.body.status === 12) {
        //     res.json({
        //         status: 400,
        //         msg: 'No Admin exist with these Credentials!',
        //     })
        //     return
        // } else if (userInfo.isSuperAdmin && req.body.status === 21) {
        //     res.json({ status: 400, msg: 'User is already Super Admin' })
        //     return
        // } else if (!userInfo.isSuperAdmin && req.body.status === 22) {
        //     res.json({
        //         status: 400,
        //         msg: 'No Super Admin exist with these Credentials!',
        //     })
        //     return
        // }

        if (userInfo && userInfo.length) {
            // let changeUserWalletAddress = await models.users.updateOne(
            //     {metamaskKey: userInfo[0].metamaskKey},
            //     {'$set': {metamaskKey: req.body.walletAddr}}
            // )
            if (req.body.status === 11 || req.body.status === 12) {
                try {
                    const makeAdmin = await models.users.updateOne(
                        {
                            _id: userId,
                        },
                        {
                            $set: {
                                isAdmin: req.body.status == 11 ? true : false,
                                isSuperAdmin:
                                    req.body.status == 12
                                        ? false
                                        : userInfo[0].isSuperAdmin,
                            },
                        }
                    )
                    res.json({
                        status: 200,
                        msg: 'Success',
                        data: makeAdmin,
                    })

                    return
                } catch (err) {
                    console.log(err)
                    res.json({ status: 400, msg: 'Something went wrong' })
                    return
                }
            } else if (req.body.status === 21 || req.body.status === 22) {
                try {
                    const makeSuperAdmin = await models.users.updateOne(
                        {
                            _id: userId,
                        },
                        {
                            $set: {
                                isSuperAdmin:
                                    req.body.status == 21 ? true : false,
                                isAdmin: req.body.status == 22 ? false : true,
                            },
                        }
                    )
                    res.json({
                        status: 200,
                        msg: 'Success',
                        data: makeSuperAdmin,
                    })

                    return
                } catch (err) {
                    console.log(err)
                    res.json({ status: 400, msg: 'Something went wrong' })
                    return
                }
            }
            // let changeUserStatus
            // if (changeUserWalletAddress.modifiedCount == 1) {
            //     if (req.body.status == 1) {
            //         changeUserStatus = await models.users.updateOne(
            //             { isSuperAdmin: userInfo[0].isSuperAdmin },
            //             {
            //                 $set: {
            //                     isSuperAdmin:
            //                         req.body.status == 1 ? true : false,
            //                 },
            //             }
            //         )
            //     } else {
            //         changeUserStatus = await models.users.updateOne(
            //             { isAdmin: userInfo[0].isAdmin },
            //             {
            //                 $set: {
            //                     isAdmin: req.body.status == 1 ? true : false,
            //                 },
            //             }
            //         )
            //     }
            // }

            // if (changeUserStatus.modifiedCount == 1) {
            //     const updatedUserInfo = await models.users.find({
            //         _id: req.body.userId,
            //     })
            //     res.json({ status: 200, msg: 'Success', data: updatedUserInfo })
            // } else {
            //     res.json({ status: 400, msg: 'Something went wrong' })
            // }
        } else {
            res.json({ status: 400, msg: 'User not found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const setactivity = async function (req, res) {
    const { activity, timestamp } = req.body
    await models.users.updateOne(
        { _id: req.body.userId },
        { $push: { activity: { activity: activity, timestamp: timestamp } } },
        { new: true, upsert: true }
    )
    res.json('done')
}

const getactivity = async function (req, res) {
    const userActivity = await models.users.findOne({ _id: req.body.userId })
    res.json({ userActivity: userActivity?.activity })
}

module.exports = {
    register,
    test,
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
}
