const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    createNft,
    getAllNft,
    updateNft,
    deleteNft,
} = require('../controller/nftController')

router.get('/', cors(), getAllNft)
router.post('/create', cors(), createNft)
router.post('/update', cors(), updateNft)
router.post('/delete', cors(), deleteNft)
module.exports = router
