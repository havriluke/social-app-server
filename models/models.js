const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Users = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, defaultValue: process.env.DEFAULT_AVATAR },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    banStatus: { type: DataTypes.BIGINT, defaultValue: 0 }
})

const Posts = sequelize.define('posts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, defaultValue: '' },
    datetime: { type: DataTypes.BIGINT },
    edit: {type: DataTypes.BOOLEAN, defaultValue: false},
    private: { type: DataTypes.BOOLEAN, defaultValue: false },
    likesCount: {type: DataTypes.INTEGER, defaultValue: 0 },
    commentsCount: {type: DataTypes.INTEGER, defaultValue: 0 },
    photo: {type: DataTypes.STRING, defaultValue: null}
})

const Likes = sequelize.define('likes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Comments = sequelize.define('comments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false }
})

const Friends = sequelize.define('friends', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    accepted: { type: DataTypes.BOOLEAN, defaultValue: false }
})

const Messages = sequelize.define('messages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    edited: {type: DataTypes.BOOLEAN, defaultValue: false},
    datetime: { type: DataTypes.BIGINT }
})

const Chats = sequelize.define('chats', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Users.hasMany(Posts)
Posts.belongsTo(Users)

Users.hasMany(Comments)
Comments.belongsTo(Users)

Users.hasMany(Likes)
Likes.belongsTo(Users)

Users.hasMany(Messages)
Messages.belongsTo(Users)

Chats.hasMany(Messages)
Messages.belongsTo(Chats)

Posts.hasMany(Likes)
Likes.belongsTo(Posts)

Posts.hasMany(Comments)
Comments.belongsTo(Posts)

Users.belongsToMany(Users, { as: 'userOne', foreignKey: 'userOneId', through: Chats })
Users.belongsToMany(Users, { as: 'userTwo', foreignKey: 'userTwoId', through: Chats })

Users.belongsToMany(Users, { as: 'user', foreignKey: 'userId', through: Friends })
Users.belongsToMany(Users, { as: 'friend', foreignKey: 'friendId', through: Friends })


module.exports = {
    Users, Posts, Likes, Comments, Messages, Friends, Chats
}
