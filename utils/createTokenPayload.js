const createTokenPayload = (user) => {
    return {
        username: user.username,
        userId: user._id,
        isAdmin: user.isAdmin,
    }
}

const createWalletAddressPayload = (obj, walletAddress) => {
    return { userId: obj._id, publicAddress: walletAddress }
}

module.exports = { createTokenPayload, createWalletAddressPayload }
