const Token = require('../models/Token')
const User = require('../models/User')
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

const login = async function (req, res) {
    try {
        const { address } = req.body

        if (address === undefined || address === '') {
            res.json({ status: 401, msg: 'Address is required' })
            return
        }

        query = { walletAddress: address }
        const checkWallet = await User.findOne(query)

        if (checkWallet) {
            // User Exists
            res.json({ status: 200, msg: 'Success', userInfo: checkWallet })
            return
        } else {
            // Create a new User
            const user = await User.create(query)
            await user.save()
            res.json({ status: 200, msg: 'User Created', userInfo: user })
            return
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllSuperAdmin = async function (req, res) {
    try {
        const superAdmin = await User.find({ isSuperAdmin: true })

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
        const admin = await User.find({ isAdmin: true })

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
        const userData = await User.findOne({
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

        const userInfo = await User.find({ _id: userId })
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
            // let changeUserWalletAddress = await User.updateOne(
            //     {metamaskKey: userInfo[0].metamaskKey},
            //     {'$set': {metamaskKey: req.body.walletAddr}}
            // )
            if (req.body.status === 11 || req.body.status === 12) {
                try {
                    const makeAdmin = await User.updateOne(
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
                    const makeSuperAdmin = await User.updateOne(
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
            //         changeUserStatus = await User.updateOne(
            //             { isSuperAdmin: userInfo[0].isSuperAdmin },
            //             {
            //                 $set: {
            //                     isSuperAdmin:
            //                         req.body.status == 1 ? true : false,
            //                 },
            //             }
            //         )
            //     } else {
            //         changeUserStatus = await User.updateOne(
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
            //     const updatedUserInfo = await User.find({
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
    try {
        const { activity, timestamp, img, address } = req.body
        await User.updateOne(
            { walletAddress: address },
            {
                $push: {
                    activity: {
                        activity: activity,
                        timestamp: timestamp,
                        img: img,
                    },
                },
            },
            { new: true, upsert: true }
        )
        res.json('done')
    } catch (error) {
        console.log(error)
        res.json({ status: 400, msg: error.toString() })
    }
}

const getactivity = async function (req, res) {
    try {
        const userActivity = await User.findOne({
            walletAddress: req.body.address,
        })
        res.json({ userActivity: userActivity?.activity })
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

module.exports = {
    login,
    getAllSuperAdmin,
    getAllAdmin,
    changeUserStatus,
    setactivity,
    getactivity,
}
