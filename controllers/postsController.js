const ApiError = require('../error/ApiError')
const {Posts, Likes, Comments, PostPhotos, Friends, Users} = require('../models/models')
const {Op} = require('sequelize')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')


class PostsController {

    async create(req, res, next) {
        const userId = req.user.id
        const {text, isPrivate} = req.body
        if (!text.trim().length || text.length > 500) {
            return next(ApiError.badRequest('Invalid post body'))
        }
        let post = await Posts.create({datetime: Date.now(), userId, text, private: isPrivate, edit: false})
        post = await Posts.findOne({where: {id: post.id}, include: Users})
        try {
            const {photo} = req.files
            let filename = uuid.v4() + '.jpg'
            photo.mv(path.resolve(__dirname, '..', 'static', filename))
            await post.update({photo: filename})
        } catch {
            console.log(100000);
        }
        return res.json(post)
    }

    async remove(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        const post = await Posts.findOne({where: {id}})
        if (post.userId !== userId && req.user.role !== "ADMIN" || !post) {
            return next(ApiError.internal('You can delete only own posts'))
        }
        if (post.photo) fs.unlink(path.join(__dirname, '..', 'static', post.photo), (err) => {if (err) throw err})
        await Likes.destroy({where: {postId: id}})
        await Comments.destroy({where: {postId: id}})
        await post.destroy()
        return res.json(post)
    }

    async edit(req, res, next) {
        const userId = req.user.id
        const {id, text, isPrivate} = req.body
        let post = await Posts.findOne({where: {id, userId}})
        if (!post) {
            return next(ApiError.internal('You can edit only own posts'))
        }
        if (!text.trim().length || text.length > 500) {
            return next(ApiError.badRequest('Invalid post body'))
        }
        await post.update({text, private: isPrivate, edit: true})
        post = await Posts.findOne({where: {id}, include: Users})
        return res.json(post)
    }

    async getFeed(req, res) {
        const userId = req.user.id
        let {limit, page} = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        let offset = page * limit - limit
        const friendships = await Friends.findAll({where: {
            [Op.or]: [{userId}, {friendId: userId}], accepted: true
        }})
        const friendsId = friendships.map(f => f.userId === userId ? f.friendId : f.userId)
        const posts = await Posts.findAndCountAll({where: {
            [Op.or]: [{userId: friendsId}, {userId}]
        }, limit, offset, order: [['datetime', 'DESC']], include: {
            model: Users, attributes: ['id', 'nickname', 'photo']
        }})
        return res.json(posts)  
    }

    async getByUser(req, res, next) {
        const userId = req.user.id
        let {id, limit, page} = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        id = parseInt(id)
        let offset = page * limit - limit
        const friendship = await Friends.count({where: {
            [Op.or]: [{userId: userId, friendId: id}, {userId: id, friendId: userId}], accepted: true
        }})
        let posts
        if (friendship || userId === id || req.user.role === 'ADMIN') {
            posts = await Posts.findAndCountAll({where: {userId: id}, limit, offset, order: [['datetime', 'DESC']], include: {
                model: Users, attributes: ['id', 'nickname', 'photo']
            }})
        } else {
            posts = await Posts.findAndCountAll({where: {userId: id, private: false}, limit, offset, order: [['datetime', 'DESC']], include: {
                model: Users, attributes: ['id', 'nickname', 'photo']
            }})
        }
        return res.json(posts)
    }

    async toggleLike(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        let post = await Posts.findOne({where: {id}})
        const friendship = await Friends.count({where: {
            [Op.or]: [{userId, friendId: post.userId}, {userId: post.userId, friendId: userId}], accepted: true
        }})
        if (!friendship && post.private && post.userId !== userId) {
            return next(ApiError.internal('You cannot to set the like under this post'))
        }
        let like = await Likes.findOne({where: {userId, postId: id}})
        if (like) {
            await like.destroy()
            await post.update({likesCount: post.likesCount-1})
        } else {
            like = await Likes.create({userId, postId: id})
            await post.update({likesCount: post.likesCount+1})
        }
        return res.json(post)
    }

    async createComment(req, res, next) {
        const userId = req.user.id
        const {id, text} = req.body
        if (!text.trim().length || text.length > 150) {
            return next(ApiError.badRequest('Invalid comment'))
        }
        let post = await Posts.findOne({where: {id}})
        const friendship = await Friends.count({where: {
            [Op.or]: [{userId, friendId: post.userId}, {userId: post.userId, friendId: userId}], accepted: true
        }})
        if (!friendship && post.private && userId !== post.userId) {
            return next(ApiError.internal('You cannot to write the comment under this post'))
        }
        let comment = await Comments.create({userId, postId: id, text})
        comment = await Comments.findOne({where : {id: comment.id}, include: Users})
        return res.json(comment)
    }

    async deleteComment(req, res, next) {
        const userId = req.user.id
        const {id} = req.body
        if (!id) {
            return next(ApiError.badRequest('Comment does not exist'))
        }
        const comment = await Comments.findOne({where: {id}})
        if (comment.userId === userId || req.user.role === 'ADMIN') {
            await comment.destroy()
        }
        return res.json(comment)
    }

    async getComments(req, res, next) {
        const userId = req.user.id
        let {limit, page, id} = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        id = parseInt(id)
        let offset = page * limit - limit
        let post = await Posts.findOne({where: {id}})
        const friendship = await Friends.count({where: {
            [Op.or]: [{userId, friendId: post.userId}, {userId: post.userId, friendId: userId}], accepted: true
        }})
        if (!friendship && post.private && post.userId !== userId) {
            return next(ApiError.internal('You have not access to comments under this post'))
        }
        const comments = await Comments.findAndCountAll({where: {postId: id}, offset, limit, include: {
            model: Users, attributes: ['id', 'nickname']
        }})
        return res.json(comments)
    }

    async getLikes(req, res, next) {
        const {id} = req.query
        const likes = await Likes.findAll({where: {postId: id}, include: {
            model: Users, attributes: ['id']
        }})
        return res.json(likes)
    }

}

module.exports = new PostsController()