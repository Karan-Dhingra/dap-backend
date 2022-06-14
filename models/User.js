const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        walletAddress: {
            type: 'string',
            unique: true,
            required: true,
        },
        isAdmin: { type: Boolean, default: false },
        isSuperAdmin: { type: Boolean, default: false },
        isDiscordConnected: {
            type: Boolean,
            default: false,
        },
        discordInfo: {
            type: Object,
            default: {},
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifiedOn: Date,
        activity: {
            type: [],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
