

const express = require('express');
const userController = require('../controllers/user.controller.js');
const verifyToken = require('../middleware/verify.js');

const router = express.Router();

// Update User
router.put("/:id", verifyToken, userController.update)

// Delete User
router.delete("/:id", verifyToken, userController.deleteUser)

// Get User
router.get("/findUser/:id", userController.getUser)

// Subscribe a User
router.put("/sub/:channelId", verifyToken, userController.subscribe)

// Unsubscribe a User
router.put("/unsub/:channelId", verifyToken, userController.unsubscribe)

// Like a User
router.put("/like/:videoId", verifyToken, userController.like)
// Dislike a User
router.put("/dislike/:videoId", verifyToken, userController.dislike)
// Save To watch later
router.put("/save_to_watch/:videoId", verifyToken, userController.saveToWatchLater)

module.exports = router