const express = require('express'); 
const router = express.Router();
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../config/multerConfig')

router.post('/register',upload.single('photo'), authController.register)
router.post('/login',authController.login)
router.get('/profil/about/:id',authController.getAbout)


module.exports = router

