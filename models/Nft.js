const mongoose = require('mongoose')
const User = require('./User')
const Schema = mongoose.Schema

const nftSchema = new Schema(
    {
        name: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        price: {
            type: 'string',
            required: true,
        },
        nftType: {
            type: Number,
            max: 2,
            min: 0,
            default: 0,
            required: true,
            // 0. Raphel
            // 1. Whhitelisted
            // 2. Scratch Card
        },
        timer: {
            type: Date,
        },
        nftImage: {
            type: 'string',
            required: true,
        },
        owner: {
            type: 'string',
            required: true,
        },
        isParticipated: {
            type: Boolean,
            default: false,
        },
        participatedBy: {
            type: Array,
            default: [],
        },
        personName: {
            type: Array,
            default: [],
        },
        specialRoleLimit: {
            type: String,
            default: 1,
        },
        defaultRoleLimit: {
            type: String,
            default: 1,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Nft', nftSchema)
