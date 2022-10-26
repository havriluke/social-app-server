const Router = require('express')
const router = new Router()
const messagesRouter = require('./messagesRouter')
const userRouter = require('./userRouter')
const friendsRouter = require('./friendsRouter')
const postsRouter = require('./postsRouter')

router.use('/user', userRouter)
router.use('/messages', messagesRouter)
router.use('/friends', friendsRouter)
router.use('/posts', postsRouter)

module.exports = router
