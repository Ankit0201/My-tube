

const express = require('express');
const CommentControllers = require('../controllers/comment.controller');
const verifyToken = require('../middleware/verify.js');

const router = express.Router();
router.post('/', verifyToken, CommentControllers.addComment);
router.delete('/:id', verifyToken, CommentControllers.deleteComment)
router.get('/:videoId', CommentControllers.getComment)
module.exports = router