const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload')
const albumController = require('../controllers/album')


// use jwt after connecting frontend and backend
const checkAuth = require('../middleware/auth-checker')


router.get('/', albumController.getAlbums);

router.get('/creator/:userId', albumController.getAlbumByCreator);



router.use(checkAuth)


router.post('/', fileUpload.single('image'), albumController.createAlbum);

router.get('/:albumId', checkAuth, albumController.getAlbumById);

router.delete('/:albumId', checkAuth, albumController.deleteAlbums);

router.patch('/:albumId', checkAuth, albumController.updateAlbum);

module.exports = router;