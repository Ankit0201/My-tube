const User = require('../models/User');
const VideoModel = require('../models/Video')
const createError = require('../error');

// Update User
const update = async (req, res, next) => {
    try {
        let { id } = req.params;
        let updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}
// Delete User
const deleteUser = async (req, res, next) => {
    try {
        let { id } = req.params;
        await User.findByIdAndDelete(id)
        res.status(200).json("Delete  Successfully")
    } catch (error) {
        next(error)
    }
}
// Get User
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const userDetails = await User.findById(id, { password: 0 })
        if (!userDetails) return next(createError(404, 'User Not Found'));
        res.status(200).json(userDetails)

    } catch (error) {
        next(error)
    }
}
// Subscribe User
const subscribe = async (req, res, next) => {
    try {
        let { channelId } = req.params
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: channelId }
        })
        await User.findByIdAndUpdate(channelId, { $inc: { subscribers: 1 } })
        res.status(200).json("Subscription Successfull.")

    } catch (error) {
        next(error)
    }
}
// UnSubscribe User
const unsubscribe = async (req, res, next) => {
    try {
        let { channelId } = req.params
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: channelId }
        })
        await User.findByIdAndUpdate(channelId, { $inc: { subscribers: -1 } })
        res.status(200).json("UnSubscription Successfull.")
    } catch (error) {
        next(error)
    }
}
// Like Video User
const like = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { videoId } = req.params;
        let likedVideo = await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        }, { new: true })
        if (likedVideo) {
            likedVideo.userId = await User.findById(likedVideo.userId)
            res.status(200).json(likedVideo)
        }
    } catch (error) {
        next(error)
    }
}
// Delete User
const dislike = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { videoId } = req.params;
        let disLikedVideo = await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        }, { new: true })
        if (disLikedVideo) {
            disLikedVideo.userId = await User.findById(disLikedVideo.userId)
            res.status(200).json(disLikedVideo)
        }

    } catch (error) {
        next(error)
    }
}

const saveToWatchLater = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        let msg = "";
        let updateHis
        if (req.body.action == "add") {
            updateHis = await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { watch_later: videoId }
            }, { new: true })
            msg = "Video has been saved to Watch List"
        } else {
            updateHis = await User.findByIdAndUpdate(req.user.id, {
                $pull: { watch_later: videoId }
            }, { new: true })
            msg = "Video has been removed from Watch List"
        }

        if (updateHis) {
            res.status(200).json(msg)
        }

    } catch (error) {

    }
}

module.exports = {
    update, deleteUser, subscribe, unsubscribe, dislike, like, getUser, saveToWatchLater
}