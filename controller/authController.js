const Token = require('../models/Token')
const url = require('url')
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
const { default: axios } = require('axios')

const login = async (req, res) => {
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

const getAllSuperAdmin = async (req, res) => {
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

const getAllAdmin = async (req, res) => {
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

const addToDiscord = async (req, res) => {
    try {
        const { address, discordData } = req.body

        if (address === undefined || address === '') {
            res.json({ status: 401, msg: 'Address is required' })
            return
        }

        query = { walletAddress: address }
        const checkWallet = await User.findOne(query)

        if (checkWallet) {
            const response = await User.updateOne(query, {
                $set: {
                    isDiscordConnected: true,
                    discordInfo: discordData,
                },
            })

            res.json({ status: 200, msg: 'Discord Connected', data: response })
            return
        } else {
            res.json({ status: 500, msg: 'User does not exist' })
            return
        }
    } catch (error) {
        res.json({ status: 500, msg: error.toString() })
        return
    }
}

const removeDiscord = async (req, res) => {
    try {
        const { address } = req.body

        if (address === undefined || address === '') {
            res.json({ status: 401, msg: 'Address is required' })
            return
        }

        query = { walletAddress: address }
        const checkWallet = await User.findOne(query)

        if (checkWallet) {
            const response = await User.updateOne(query, {
                $set: {
                    isDiscordConnected: false,
                    discordInfo: {},
                },
            })

            res.json({
                status: 200,
                msg: 'Discord Disconnected',
                data: response,
            })
            return
        } else {
            res.json({ status: 500, msg: 'User does not exist' })
            return
        }
    } catch (error) {
        res.json({ status: 500, msg: error.toString() })
        return
    }
}

const connectToDiscord = async (req, res) => {
    try {
        const API_ENDPOINT = 'https://discord.com/api/v10'
        const CLIENT_ID = process.env.DISCORD_CLIENT_ID
        const CLIENT_SECRET = process.env.DISCORD_SECRET_KEY
        const REDIRECT_URI = `${process.env.APP_FRONTEND_URL}/api/auth/discord/redirect`
        const { code } = req.body

        if (!code) {
            res.json({ status: 401, msg: 'Code is required' })
            return
        }

        const formData = new url.URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        })

        await axios
            .post(`${API_ENDPOINT}/oauth2/token`, formData.toString())
            .then(async (response) => {
                const { access_token, refresh_token } = response.data
                console.log(access_token)
                await axios
                    .get(`https://discord.com/api/v10/users/@me`, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: 'Bearer ' + access_token,
                        },
                    })
                    .then(async (response) => {
                        let userData = response.data
                        await axios
                            .get(
                                `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userData.id}`,
                                {
                                    headers: {
                                        'Content-Type':
                                            'application/x-www-form-urlencoded',
                                        Authorization:
                                            'Bot ' + process.env.DISCORD_BOT_ID,
                                    },
                                }
                            )
                            .then(async (response) => {
                                const userRoles = response.data.roles
                                await axios
                                    .get(
                                        `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/roles`,
                                        {
                                            headers: {
                                                'Content-Type':
                                                    'application/x-www-form-urlencoded',
                                                Authorization:
                                                    'Bot ' +
                                                    process.env.DISCORD_BOT_ID,
                                            },
                                        }
                                    )
                                    .then((response) => {
                                        const defaultRoles = response.data
                                        let roles = []
                                        userRoles.forEach((r) => {
                                            defaultRoles.forEach((f) => {
                                                if (f.id === r) {
                                                    roles.push({
                                                        id: f.id,
                                                        name: f.name,
                                                    })
                                                }
                                            })
                                        })
                                        userData = { ...userData, roles }
                                        res.json({
                                            status: 200,
                                            msg: 'Success',
                                            userData,
                                        })
                                        return
                                    })
                                    .catch((err) => {
                                        console.log(err)

                                        res.json({
                                            status: 500,
                                            msg:
                                                err.response.data.error ||
                                                err.toString(),
                                        })
                                        return
                                    })
                            })
                            .catch((err) => {
                                console.log(err)

                                res.json({
                                    status: 500,
                                    msg:
                                        err.response.data.error ||
                                        err.toString(),
                                })
                                return
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.json({
                            status: 500,
                            msg: err.response.data.error || err.toString(),
                        })
                        return
                    })
            })
            .catch((err) => {
                console.log(err)

                res.json({
                    status: 500,
                    msg: err.response.data.error || err.toString(),
                })
                return
            })
    } catch (error) {
        console.log(error)

        res.json({ status: 500, msg: error.toString() })
        return
    }
}

const changeUserStatus = async (req, res) => {
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

const setactivity = async (req, res) => {
    try {
        const { activity, timestamp, img, address, price } = req.body
        await User.updateOne(
            { walletAddress: address },
            {
                $push: {
                    activity: {
                        activity: activity,
                        timestamp: timestamp,
                        img: img,
                        price: price,
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

const getactivity = async (req, res) => {
    try {
        const userActivity = await User.findOne({
            walletAddress: req.body.address,
        })
        res.json({ userActivity: userActivity?.activity })
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const stakeData = async (req, res) => {
    try {
        await axios
            .get(
                `https://staking.ethx.ai/api/staking?address=0x5a096B978810F1EaF25F653F85563Cea583003A3`
            )
            .then((res) => {
                console.log(res.data)
                const data = res.data
                res.json({ status: 200, msg: 'Success', data })
            })
            .catch((err) => {
                console.log(err)
                res.json({ status: 400, msg: err.toString() })
            })
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
    addToDiscord,
    connectToDiscord,
    getactivity,
    stakeData,
    removeDiscord,
}
