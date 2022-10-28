const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME_HEROKU,
    process.env.DB_USER_HEROKU,
    process.env.DB_PASSWORD_HEROKU,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST_HEROKU,
        port: process.env.DB_PORT_HEROKU
    }
)