const {Messages, Users, Friends, Chats, Photos} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')
const sequelize = require('sequelize')

class MessagesController {

    async create(req, res, next) {
        const userId = req.user.id
        const {friendId, text} = req.body
        if (!text.trim().length) {
            return next(ApiError.internal('Empty message'))
        }
        let chat = await Chats.findOne({where: {
            [Op.or]: [{userOneId: userId, userTwoId: friendId}, {userOneId: friendId, userTwoId: userId}]
        }})
        if (!chat) {
            chat = await Chats.create({userOneId: userId, userTwoId: friendId})
        }
        const message = await Messages.create({text, datetime: Date.now(), userId, chatId: chat.id})
        return res.json({message, chat})
    }

    async remove(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const message = await Messages.findOne({where: {id, userId}})
        if (!message) {
            return next(ApiError.internal('You can delete only own messages'))
        }
        await message.destroy()
        const chatMessages = await Messages.count({where: {chatId: message.chatId}})
        if (!chatMessages) {
            await Chats.destroy({where: {id: message.chatId}})
        }
        return res.json(message)
    }

    async edit(req, res, next) {
        const userId = req.user.id
        const {id, text} = req.body
        const message = await Messages.findOne({where: {id, userId}})
        if (!message) {
            return next(ApiError.internal('You can edit only own messages'))
        }
        if (!text.trim().length) {
            return next(ApiError.internal('Empty message'))
        }
        await message.update({text, edited: true })
        return res.json(message)
    }

    async removeChat(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const chat = await Chats.findOne({where: {id, [Op.or]: [{userOneId: userId}, {userTwoId: userId}]}})
        if (!chat) {
            return next(ApiError.internal('Invalid chatID'))
        }
        await Messages.destroy({where: {chatId: id}})
        await chat.destroy()
        return res.json(chat)
    }

    async getChats(req, res) {
        const userId = req.user.id
        let {limit, page} = req.query
        page = parseInt(page) || 1
        limit = parseInt(limit) || 5
        let offset = page * limit - limit
        const chats = await Chats.findAll({ attributes: ['id'], where: {
            [Op.or]: [{userOneId: userId}, {userTwoId: userId}]
        }})
        const unreadMessages = await Messages.findAll({where: {chatId: {[Op.or]: [...chats.map(c => c.id)]}, read: false, [Op.not]: {userId}}, include: {
            model: Chats, attributes: ['id']
        }})
        if (!chats.map(c => c.id).length) return res.json({count: 0, rows: []})
        const lastMessagesId = await Messages.findAll({ attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxId']], where: {
            chatId: {[Op.or]: chats.map(c => c.id)}
        }, group: 'chatId'})
        const messages = await Messages.findAndCountAll({where: {id: {[Op.or]: [...lastMessagesId.map(l => l.dataValues.maxId)]}},
            order: [['datetime', 'DESC']], limit, offset, include: {model: Chats, attributes: ['id', 'userOneId', 'userTwoId']}})
        const companions = await Users.findAll({ attributes: ['id', 'nickname'], where: {
            id: {[Op.or]: [...messages.rows.map(m => m.dataValues.chat.userTwoId === userId ? m.dataValues.chat.userOneId : m.dataValues.chat.userTwoId)]}
        }, include: {model: Photos, attributes: ['name']}})
        messages.rows.forEach(m => {
            m.dataValues['companion'] = companions.filter(com => [m.dataValues.chat.userOneId, m.dataValues.chat.userTwoId].includes(com.dataValues.id))[0]
            m.dataValues['unreadCount'] = unreadMessages.filter(um => um.dataValues.chat.id === m.dataValues.chat.id).length
        })
        return res.json(messages)
    }

    async getChat(req, res, next) {
        const userId = req.user.id
        let {id, limit, page} = req.query
        const chat = await Chats.findOne({where: {id, [Op.or]: [{userOneId: userId}, {userTwoId: userId}]}})
        if (!chat) {
            return next(ApiError.internal('Invalid chatID'))
        }
        await Messages.update({read: true}, {where: {chatId: chat.id, [Op.not]: {userId}, read: false}})
        page = parseInt(page) || 1
        limit = parseInt(limit) || 50
        let offset = page * limit - limit
        const messages = await Messages.findAndCountAll({where: { chatId: chat.id }, limit, offset, order: [['datetime', 'DESC']], include: {
            model: Users, attributes: ['id', 'nickname']
        }})
        return res.json(messages)
    }

    async getChatByUser(req, res, next) {
        const userId = req.user.id
        const {id} = req.query
        const chat = await Chats.findOne({where: {[Op.or]: [{userOneId: userId, userTwoId: id}, {userOneId: id, userTwoId: userId}]}})
        return res.json(chat)
    }

    async getChatInfo(req, res, next) {
        const userId = req.user.id
        const {id} = req.query
        const chat = await Chats.findOne({where: {id, [Op.or]: [{userOneId: userId}, {userTwoId: userId}]}})
        if (!chat) {
            return next(ApiError.internal('Invalid chatID'))
        }
        return res.json(chat)
    }

    async readMessages(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        if (!id) {
            return next(ApiError.internal('Invalid chatID'))
        }
        const chat = await Chats.count({where: {id, [Op.or]: [{userOneId: userId}, {userTwoId: userId}]}})
        if (!chat) {
            return next(ApiError.internal('Invalid chatID'))
        }
        const messages = await Messages.update({read: true}, {where: {chatId: id, [Op.not]: {userId}, read: false}})
        return res.json(messages)
    }

    async getUnreadMessages(req, res, next) {
        const userId = req.user.id
        const chats = await Chats.findAll({attributes: ['id'], where: {[Op.or]: [{userOneId: userId}, {userTwoId: userId}]}})
        if (!chats.length) return res.json(0)
        const messages = await Messages.count({where: {chatId: {[Op.or]: [...chats.map(ch => ch.id)]}, [Op.not]: {userId}, read: false}})
        return res.json(messages)
    }

}

module.exports = new MessagesController()