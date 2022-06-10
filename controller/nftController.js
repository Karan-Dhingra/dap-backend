const Nft = require('../models/Nft')
const User = require('../models/User')

const createNft = async (req, res) => {
    try {
        const nft = req.body
        console.log(nft)
        if (!nft.name) {
            res.json({ status: 404, msg: 'Name is required!' })
            return
        }
        if (!nft.description) {
            res.json({ status: 404, msg: 'Description is required!' })
            return
        }
        if (!nft.price) {
            res.json({ status: 404, msg: 'Price is required!' })
            return
        }
        if (nft.nftType === undefined) {
            res.json({ status: 404, msg: 'Nft Type is required!' })
            return
        }
        if (!nft.nftImage) {
            res.json({ status: 404, msg: 'Nft Image is required!' })
            return
        }
        if (!nft.owner) {
            res.json({ status: 404, msg: 'Owner is required!' })
            return
        }

        const ownerData = await User.findOne({ walletAddress: nft.owner })
        if (ownerData) {
            if (ownerData.isAdmin) {
                const createNft = await Nft.create({
                    name: nft.name,
                    description: nft.description,
                    price: nft.price,
                    nftType: nft.nftType,
                    timer: nft.timer,
                    nftImage: nft.nftImage,
                    owner: nft.owner,
                })

                await createNft.save()

                res.json({
                    status: 200,
                    msg: 'Nft Created successfully!!',
                    data: createNft,
                })

                return
            } else {
                res.json({ status: 404, msg: 'You are not authorized!' })
                return
            }
        } else {
            res.json({ status: 404, msg: 'Something went wrong!' })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.toString() })
    }
}

const getAllNft = async (req, res) => {
    try {
        const nfts = await Nft.find({})
        res.json({ status: 200, data: nfts })
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.toString() })
    }
}

module.exports = { createNft, getAllNft }
