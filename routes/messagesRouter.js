const Router = require('express')
const { getLastMessages } = require('../controllers/messageController')
const router = new Router()
const messagesController = require('../controllers/messageController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, messagesController.create)
router.delete('/', authMiddleware, messagesController.remove)
router.delete('/chat', authMiddleware, messagesController.removeChat)
router.put('/', authMiddleware, messagesController.edit)
router.put('/read', authMiddleware, messagesController.readMessages)
router.get('/chat', authMiddleware, messagesController.getChat)
router.get('/chat-user', authMiddleware, messagesController.getChatByUser)
router.get('/chat-info', authMiddleware, messagesController.getChatInfo)
router.get('/', authMiddleware, messagesController.getChats)
router.get('/unread', authMiddleware, messagesController.getUnreadMessages)

module.exports = router