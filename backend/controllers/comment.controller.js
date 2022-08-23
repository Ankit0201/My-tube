const CommentModel = require('../models/Comment');

const addComment = async (req, res, next) => {
    try {
        const comment = new CommentModel({ userId: req.user.id, ...req.body })
        const commentDetails = await comment.save()
        res.status(200).json(commentDetails)

    } catch (error) {
        next(error)
    }
}
const deleteComment = async (req, res, next) => {
    try {

        await CommentModel.findByIdAndDelete(req.params.id)
        res.status(200).json("Comment has been deleted")

    } catch (error) {
        next(error)
    }
}
const getComment = async (req, res, next) => {
    try {

        const commentDetails = await CommentModel.find({ videoId: req.params.videoId }).populate('userId').sort({ createdAt: -1 })
        res.status(200).json(commentDetails)

    } catch (error) {
        next(error)
    }
}


module.exports = {
    addComment, deleteComment, getComment
}
