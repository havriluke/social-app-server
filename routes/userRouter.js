const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', userController.getUserByNickname)
router.get('/byid', authMiddleware, userController.getUserById)
router.get('/confirm', authMiddleware, userController.confirmPassword)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.put('/', authMiddleware, userController.edit)
router.put('/ban', checkRole('ADMIN'), userController.setBan)
router.put('/remove-ban', checkRole('ADMIN'), userController.removeBan)

module.exports = router