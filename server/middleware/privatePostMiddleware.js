const jwt = require('jsonwebtoken')
const {Friends, Posts} = require('../models/models')

module.exports = function(postId) {
    return function(req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const userId = req.user.id
            let post = await Posts.findOne({where: {postId}})
            const friendship = await Friends.count({where: {
                [Op.or]: [{userId, friendId: post.userId}, {userId: post.userId, friendId: userId}], accepted: true
            }})
            if (!friendship && post.private) {
                return res.status(401).json({message: 'You have not access to thist post'})
            }
            next()
        } catch(e) {
            res.status(401).json({message: 'User has not authorized'})
        }
    }
}