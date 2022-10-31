const Router = require('express')
const postsController = require('../controllers/postsController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, postsController.create)
router.delete('/', authMiddleware, postsController.remove)
router.put('/', authMiddleware, postsController.edit)
router.get('/', authMiddleware, postsController.getFeed)
router.get('/user', authMiddleware, postsController.getByUser)
router.post('/like', authMiddleware, postsController.toggleLike)
router.get('/like', authMiddleware, postsController.getLikes)
router.post('/comment', authMiddleware, postsController.createComment)
router.get('/comment', authMiddleware, postsController.getComments)
router.delete('/comment', authMiddleware, postsController.deleteComment)
router.post('/photo', authMiddleware, postsController.uploadPhoto)


module.exports = router