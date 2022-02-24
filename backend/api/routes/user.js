const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload')
const userController = require('../controllers/user')
const checkAuth = require('../middleware/auth-checker')


router.get('/', userController.getUsers);

router.post('/signup', fileUpload.single('image'), userController.signUp);

router.post('/login', userController.logIn);

router.get('/creator/:userId', userController.getUsersById)

router.use(checkAuth)

router.delete('/delete/:userId', userController.deleteUser);

module.exports = router;