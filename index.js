require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const http = require('http')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const path = require('path')

const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

const server = http.createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server starts on port ${PORT}`))
        let connectedUsers = []
        io.on('connection', (socket) => {
            socket.on('join-room', (room) => {
                socket.join(room)
                if (room.includes('n')) {
                    connectedUsers = connectedUsers.filter(obj => obj.userId !== parseInt(room.split('n')[1]))
                    connectedUsers.push({socketId: socket.id, userId: parseInt(room.split('n')[1])})
                }
            })
            socket.on('send-message', (room, message, friendId) => {
                io.in(room).allSockets().then((data) => {
                    if (data.size === 1) {
                        socket.to('n'+friendId).emit('notification-message', message, room)
                    } else {
                        socket.to(room).emit('send-message', message)
                    }
                })
            })
            socket.on('leave-room', (room) => {
                socket.leave(room)
            })
            socket.on('edit-messages', (messages, room) => {
                socket.to(room).emit('edit-messages', messages)
            })
            socket.on('delete-message', (message, room) => {
                socket.to(room).emit('delete-message', message)
            })
            socket.on('type', (room) => {
                socket.to(room).emit('type')
            })
            socket.on('send-request', (friendId) => {
                socket.to('n'+friendId).emit('send-request')
            })
            socket.on('cancel-request', (friendId) => {
                socket.to('n'+friendId).emit('cancel-request')
            })
            socket.on('set-ban', (userId) => {
                socket.to('n'+userId).emit('set-ban')
            })
            socket.on('disconnect', () => {
                connectedUsers = connectedUsers.filter(obj => obj.socketId !== socket.id)
            })
            socket.on('online', (authorId, setOnline) => {
                if(connectedUsers.filter(cu => cu.userId === authorId).length) {
                    setOnline()
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}

start()


