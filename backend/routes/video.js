

const express = require('express');
const videControllers = require('../controllers/video.controller');
const verifyToken = require('../middleware/verify');

const router = express.Router();
// Create a Video
router.post('/', verifyToken, videControllers.addVideo)
router.put('/:id', verifyToken, videControllers.updateVideo)
router.delete('/:id', verifyToken, videControllers.deleteVideo)
router.get('/find/:id', verifyToken, videControllers.getVideo)
router.get('/getAllVideos', videControllers.getAllVideo)
router.put('/view/:id', videControllers.addView)
router.get('/trend', videControllers.trendVideo)
router.get('/random', videControllers.randomVideo)
router.get('/sub', verifyToken, videControllers.subscribedVideo)
router.get('/tags', verifyToken, videControllers.searchByTags)
router.get('/searchByTitle', videControllers.searchByTitle)
router.get("/history", verifyToken, videControllers.history)
router.get("/watch_later", verifyToken, videControllers.watchList)
module.exports = router