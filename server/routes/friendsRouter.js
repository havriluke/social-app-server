const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const friendsController = require('../controllers/friendsController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/accepted', authMiddleware, friendsController.getFriends)
router.get('/requests', authMiddleware, friendsController.getRequests)
router.get('/user-requests', authMiddleware, friendsController.getUserRequests)
router.get('/all', checkRole('ADMIN'), friendsController.getAll)
router.post('/', authMiddleware, friendsController.sendRequest)
router.delete('/', authMiddleware, friendsController.deleteFriend)
router.put('/', authMiddleware, friendsController.acceptRequest)
router.get('/', authMiddleware, friendsController.getFriendsByid)
router.get('/friend', authMiddleware, friendsController.getFriendship)
router.get('/search', authMiddleware, friendsController.getSearch)

module.exports = router