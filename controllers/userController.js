const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Users, Photos} = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const generateJwt = (id, nickname, role, banStatus, photo) => {
    return jwt.sign(
        {id, nickname, role, banStatus, photo},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

function checkNickname(nickname) {
    let isLegit = true
    let regExsp =  /^[A-Za-z]([A-Za-z0-9_]+)$/g
    isLegit =  nickname.match(regExsp) ? isLegit : false
    isLegit = nickname.length > 16 || nickname.length < 4 ? false : isLegit
    return isLegit
}


class UserController {
    
    async registration(req, res, next) {
        const {nickname, password} = req.body
        if (!nickname || !password) {
            return next(ApiError.badRequest('Некоректний нікнейм або пароль'))
        }
        const candidate = await Users.findOne({where: {nickname}})
        if (candidate || !checkNickname(nickname)) {
            return next(ApiError.badRequest('Нікнейм недоступний'))
        }
        if (password.trim().length < 8) {
            return next(ApiError.badRequest('Слабкий пароль'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await Users.create({nickname, password: hashPassword})
        const token = generateJwt(user.id, user.nickname, user.role, user.banStatus, null)
        return res.json({token})
    }

    async login(req, res, next) {
        const {nickname, password} = req.body
        const user = await Users.findOne({where: {nickname}, include: {model: Photos, attributes: ['name']}})
        if (!user) {
            return next(ApiError.badRequest('Хибний нікнейм'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.forbidden('Хибний пароль'))
        }
        if (user.banStatus > Date.now()) {
            const stopBanDate = new Date(user.banStatus)
            return next(ApiError.forbidden(`Вас забанено до ${stopBanDate.getDate()}.${stopBanDate.getMonth()+1}.${stopBanDate.getFullYear()}`))
        } else {
            user.banStatus = 0
        }
        const token = generateJwt(user.id, user.nickname, user.role, user.banStatus, user.photo)
        return res.json({token})
    }

    async check(req, res, next) {
        const user = await Users.findOne({attributes: ['id', 'nickname', 'role', 'banStatus'], where: {id: req.user.id}, include: {
            model: Photos, attributes: ['name']
        }})
        const token = generateJwt(user.id, user.nickname, user.role, user.banStatus, user.photo)
        return res.json({token})
    }

    async setBan(req, res, next) {
        const {id, daysCount} = req.body
        const day = 86400000
        const today = Date.now()
        const stopDate = today + parseInt(daysCount) * day
        const user = await Users.update({ banStatus: stopDate }, { where: { id }})
        res.json(user)
    }

    async removeBan(req, res, next) {
        const {id} = req.body
        const user = await Users.update({ banStatus: 0 }, { where: { id }})
        res.json(user)
    }

    async getUserByNickname(req, res, next) {
        const {nickname} = req.query
        const user = await Users.findOne({where: {nickname}, include: {model: Photos, attributes: ['name']}})
        if (!user) {
            return next(ApiError.badRequest('Користувача не знайдено'))
        }
        res.json(user)
    }

    async getUserById(req, res, next) {
        const {id} = req.query
        const user = await Users.findOne({where: {id}, include: {model: Photos, attributes: ['name']}})
        if (!user) {
            return next(ApiError.badRequest('Користувача не знайдено'))
        }
        res.json(user)
    }

    async confirmPassword(req, res, next) {
        const userId = req.user.id
        const {password} = req.query
        const user = await Users.findOne({where: {id: userId}})
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Хибний пароль'))
        }
        return res.json(comparePassword)
    }

    async edit(req, res, next) {
        const userId = req.user.id
        const {nickname, password} = req.body
        const user = await Users.findOne({where: {id: userId}, include: {model: Photos, attributes: ['id']}})
        try {
            const {photo} = req.files
            if (!!user.photoId) {
                const currentPhoto = await Photos.findOne({where: {id: user.photoId}, attributes: ['name']})
                fs.unlink(path.resolve(__dirname, '..', 'static', currentPhoto.name), (err) => {if (err) throw err})
                await Photos.destroy({where: {id: user.photoId}})
            }
            let filename = uuid.v4() + '.webp'
            photo.mv(path.resolve(__dirname, '..', 'static', filename))
            const base64Data = new Buffer.from(photo.data, 'base64')
            const photoModel = await Photos.create({data: base64Data, name: filename})
            await user.update({photoId: photoModel.id})
        } catch {}
        if (nickname) {
            const candidate = await Users.findOne({where: {nickname}})
            if (candidate || !checkNickname(nickname)) return next(ApiError.badRequest('Нікнейм недоступний'))
            await user.update({nickname})
        }
        if (password) {
            if (password.trim().length < 8) return next(ApiError.badRequest('Слабкий пароль'))
            const hashPassword = await bcrypt.hash(password, 5)
            await user.update({password: hashPassword})
        }
        return res.json(user)
    }

    async uploadAvatar(req, res, next) {
        const {name} = req.body
        if (fs.readdirSync(path.resolve(__dirname, '..', 'static')).includes(name)) return res.send('Photo has already loaded')
        const file = await Photos.findOne({where: {name}})
        const bufferData = new Buffer.from(file.data, 'base64')
        fs.writeFileSync(path.resolve(__dirname, '..', 'static', file.name), bufferData)
        return res.send('Photo was successfully loaded')
    }

}

module.exports = new UserController()
