const express = require('express')
const router = express.Router()
const cors = require('cors')
const { createNft, getAllNft } = require('../controller/nftController')

router.get('/', cors(), getAllNft)
router.post('/create', cors(), createNft)
module.exports = router
