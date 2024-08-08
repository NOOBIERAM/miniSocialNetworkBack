const express = require('express'); 
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const authController = require('../controllers/authController')
const friendsController = require('../controllers/friendsController')
const postController = require('../controllers/postControllers')
const likePostController = require('../controllers/likePostController')
const commentController = require('../controllers/commentController')
const messageController = require('../controllers/messageController')
const upload = require('../config/multerConfig')


router.post('/register',upload.single('image'), authController.register)
router.post('/login',authController.login)
router.get('/profil',authMiddleware,authController.getProfil)
router.get('/profil/user/:id',authController.getAbout)

router.post('/friend/add',friendsController.addFriend)
router.put('/friend/accept/:id',friendsController.accetptFriend)
router.delete('/friend/delete/:id',friendsController.deleteFriend)
router.get('/friend/accepted/:userId',friendsController.getAccetptedFriends)
router.get('/friend/pending/:userId',friendsController.getPendingFriend)
router.get('/friend/suggest/:userId',friendsController.getSuggestFriends)
router.get('/getFollowers/:userId',friendsController.getFollower)


router.post('/post/add',upload.single('image'),postController.addPost)
router.get('/post/getAllPost/:userId',postController.getAllPost)
router.get('/post/count/:userId',postController.getPostCount)
router.get('/post/getFriendPost/:userId',postController.getFriendPost)

router.post('/post/like',likePostController.addLike)
router.get('/post/like/count/:postId/:userId',likePostController.getCountLike)
router.get('/post/like/status',likePostController.isLiked)

router.post('/post/comment',commentController.addComment)
router.get('/post/getAllComments/:postId',commentController.getComment)
router.put('/post/updateComment/:comsId',commentController.updateComment)
router.delete('/post/deleteComment/:comsId',commentController.deleteComment)

router.post('/message/send',messageController.createMessage)
// router.get('/message/getAll',messageController.getMessage)

router.get('/message/getAll/:senderId/:receiverId',messageController.getMessage)



module.exports = router