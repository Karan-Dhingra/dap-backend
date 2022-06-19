const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const Nft = require('../models/Nft')
const User = require('../models/User')
const { default: axios } = require('axios')

const updateProfile = async (req, res) => {
    const { profilePic, userId } = req.body
    if (!userId || !profilePic) {
        return res.json({ status: 400, msg: 'All fields required' })
    }
    try {
        const user = await User.findOne({ _id: userId })
        // console.log(user)
        console.log(profilePic)
        // console.log(user.password, process.env.PASS_SEC)
        if (user) {
            const updateProfile = await User.updateOne(
                { _id: userId },
                { $set: { profilePic: profilePic } }
            )
            return res.json({
                status: 200,
                msg: 'Updated Image',
                data: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    isAdmin: user.isAdmin,
                    metamaskKey: user.metamaskKey || '',
                    isSuperAdmin: user.isSuperAdmin,
                    profilePic: user.profilePic || '',
                    referralCode: user.referralCode,
                    accessToken: user.accessToken,
                    updatedAt: user.updatedAt,
                },
            })
        } else {
            return res.json({ status: 400, msg: 'User not exists!' })
        }
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.msg })
    }
}

const participateEvent = async (req, res) => {
    try {
        const { _id, username, participatedBy, roles } = req.body
        if (!_id || !participatedBy || !username) {
            res.status(401).json({ msg: 'You are not allowed to participate' })
            return
        }
        const nft = await Nft.findOne({ _id })
        if (nft) {
            const updateNft = await Nft.updateOne(
                { _id },
                {
                    $set: {
                        isParticipated: true,
                    },
                    $push: {
                        participatedBy: {
                            participant: participatedBy,
                            timestamp: new Date().getTime(),
                            username,
                            roles,
                        },
                    },
                }
            )

            res.status(200).json({ msg: 'Success', data: updateNft })
            return
        } else {
            res.status(500).json({ msg: 'Something went wrong' })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.toString() })
    }
}

const userInfo = async (req, res) => {
    try {
        const { address } = req.body
        if (!address) {
            res.status(401).json({ msg: 'User not found' })
            return
        }

        const data = await User.findOne({ walletAddress: address })
        res.json({ status: 200, userInfo: data })
        return
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.toString() })
    }
}

const getDiscord = async (req, res) => {
    try {
        await axios
            .get(
                `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/roles`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'Bot ' + process.env.DISCORD_BOT_ID,
                    },
                }
            )
            .then((response) => {
                const roles = response.data
                // console.log(roles)
                res.json({
                    status: 200,
                    msg: 'Success',
                    roles,
                })
                return
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    msg: err.response.data.error || err.toString(),
                })
                return
            })
    } catch (error) {
        res.json({ status: 500, msg: error.toString() })
        return
    }
}

module.exports = { updateProfile, participateEvent, userInfo, getDiscord }
