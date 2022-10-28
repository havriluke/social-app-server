const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')
const {Users, Friends} = require('../models/models')
const sequelize = require('sequelize')

class FriendsController {

    async getAll(req, res, next) {
        const userId = req.user.id
        let {limit, page} = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        let offset = limit * page - limit
        const users = await Users.findAndCountAll({where: {id: {[Op.not]: userId}}, limit, offset})
        return res.json(users)
    }

    async getSearch(req, res, next) {
        let {limit, page, nickname} = req.query
        if (!nickname.length) {
            return res.json({count: 0, rows: []})
        }
        console.log(req.query);
        limit = parseInt(limit)
        page = parseInt(page)
        let offset = limit * page - limit
        const users = await Users.findAndCountAll({where: {nickname: {[Op.substring]: nickname}}, limit, offset})
        return res.json(users)
    }

    async getFriends(req, res, next) {
        const { id } = req.user
        let {limit, page} = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        let offset = limit * page - limit
        const friendships = await Friends.findAll({ where: {[Op.or]: [{userId: id}, {friendId: id}], accepted: true} })
        const friendsId = friendships.map(fs => {
            return fs.userId === id ? fs.friendId : fs.userId
        })
        const people = await Users.findAndCountAll({ attributes: ['id', 'nickname', 'photo'], where: { id: friendsId }, limit, offset })
        return res.json(people)
    }

    async getRequests(req, res, next) {
        const { id } = req.user
        let {limit, page} = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        let offset = limit * page - limit
        const requestsTo = await Friends.findAll({ where: {friendId: id, accepted: false} })
        const friendsId = requestsTo.map(fs => fs.userId)
        const people = await Users.findAndCountAll({ attributes: ['id', 'nickname', 'photo'], where: { id: friendsId }, limit, offset })
        return res.json(people)
    }

    async getUserRequests(req, res, next) {
        const { id } = req.user
        let {limit, page} = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        let offset = limit * page - limit
        const requestsFrom = await Friends.findAll({ where: {userId: id, accepted: false} })
        const friendsId = requestsFrom.map(fs => fs.friendId)
        const people = await Users.findAndCountAll({ attributes: ['id', 'nickname', 'photo'], where: { id: friendsId }, limit, offset })
        return res.json(people)
    }

    async sendRequest(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const friendship = await Friends.create({userId, friendId: id})
        return res.json({friendship})
    }

    async deleteFriend(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const row = await Friends.findOne({where: { 
            [Op.or]: [{userId, friendId: id}, {userId: id, friendId: userId}]
        }})
        if (row) await row.destroy()
        return res.json(row)
    }

    async acceptRequest(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const friendship = await Friends.update({ accepted: true }, { where: {
            userId: id, friendId: userId
        }})
        return res.json({friendship})
    }

    async getFriendsByid(req, res, next) {
        let {id, limit, page} = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        id = parseInt(id)
        let offset = limit * page - limit
        const friendships = await Friends.findAll({where: {[Op.or]: [{userId: id}, {friendId: id}], accepted: true}})
        const friendsId = friendships.map(fs => {
            return fs.userId === id ? fs.friendId : fs.userId
        })
        const friends = await Users.findAndCountAll({ attributes: ['id', 'nickname', 'photo'], where: { id: friendsId }, limit, offset })
        return res.json(friends)
    }

    async getFriendship(req, res, next) {
        let {userId, friendId} = req.query
        userId = parseInt(userId)
        friendId = parseInt(friendId)
        const friendship = await Friends.findOne({where: {
            [Op.or]: [{userId, friendId}, {userId: friendId, friendId: userId}]
        }})
        return res.json(friendship)
    }
}

module.exports = new FriendsController()