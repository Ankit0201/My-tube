const { default: mongoose } = require("mongoose");
const createError = require("../error");
const User = require("../models/User");
const VideoModel = require("../models/Video");

const addVideo = async (req, res, next) => {
    try {
        let videos = new VideoModel({ userId: req.user.id, ...req.body });
        let savedVideo = await videos.save();
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }
};
const updateVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.id);
        if (!video) return next(createError(404, "Video Not Found"));
        if (req.user.id == video.userId) {
            const updatedUser = await VideoModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.status(200).json(updatedUser);
        } else {
            return next(createError(404, "You can update only your video"));
        }
    } catch (error) {
        next(error);
    }
};
const deleteVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.id);
        if (!video) return next(createError(404, "Video Not Found"));
        if (req.user.id == video.userId) {
            const updatedUser = await VideoModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Video has been deleted");
        } else {
            return next(createError(404, "You can delete only your video"));
        }
    } catch (error) {
        next(error);
    }
};
const getVideo = async (req, res, next) => {
    try {
        let { id } = req.params;
        const updateViews = await VideoModel.findByIdAndUpdate(id, {
            $addToSet: { views: req.user.id }
        }, { new: true })
        const updateHis = await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { history: id }
        }, { new: true })
        if (updateViews && updateHis) {
            const videos = await VideoModel.findById(id).populate('userId');
            res.status(200).json(videos);
        }
    } catch (error) {
        next(error);
    }
};

const getAllVideo = async (req, res, next) => {
    try {
        const videos = await VideoModel.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'dislikes',
                foreignField: "_id",
                as: "UserData"
            }
        }]);

        res.status(200).json(videos)

    } catch (error) {
        next(error);
    }
};
const addView = async (req, res, next) => {
    try {
        let { id } = req.params;
        await VideoModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
        res.status(200).json("The view has been increased");
    } catch (error) {
        next(error);
    }
};
const randomVideo = async (req, res, next) => {
    try {
        const videos = await VideoModel.aggregate([
            { $sample: { size: 40 } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
        ]);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};
const trendVideo = async (req, res, next) => {
    try {
        const videos = await VideoModel.find().sort({ views: -1 }).populate('userId');
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

const subscribedVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribeChannel = user.subscribedUsers;
        console.log(subscribeChannel);
        const list = await Promise.all(
            subscribeChannel.map((channelId) => {
                return VideoModel.find({ userId: channelId }).populate("userId");
            })
        );
        if (list) {
            console.log(list);
            const result = list.reduce((acc, val) => acc.concat(val), []);
            let listedVideos = await result.sort((a, b) => b.createdAt - a.createdAt);
            res.status(200).json(listedVideos);
        }
    } catch (error) {
        next(error);
    }
};

const searchByTags = async (req, res, next) => {
    try {
        const tags = req.query.tags.split(",");
        const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20).populate('userId');
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};
const searchByTitle = async (req, res, next) => {
    try {
        const { q } = req.query;
        const videos = await VideoModel.find({
            title: { $regex: q.toString(), $options: "i" },
        }).limit(40).populate('userId');
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};
const history = async (req, res, next) => {
    try {
        const videos = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.user.id) } },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'history',
                    foreignField: "_id",
                    as: "historyDetails"
                }

            }, {
                $project: {
                    historyDetails: 1,
                    _id: 1

                }
            }]);
        // if (videos) {
        res.status(200).json(videos[0].historyDetails)
        // }


    } catch (error) {
        next(error);
    }
};

const watchList = async (req, res, next) => {
    try {
        const videos = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.user.id) } },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'watch_later',
                    foreignField: "_id",
                    as: "historyDetails"
                }

            }, {
                $project: {
                    historyDetails: 1,
                    _id: 1

                }
            }]);
        // if (videos) {
        res.status(200).json(videos[0].historyDetails)
        // }


    } catch (error) {
        next(error);
    }
};
module.exports = {
    addVideo,
    getVideo,
    deleteVideo,
    updateVideo,
    addView,
    randomVideo,
    trendVideo,
    subscribedVideo,
    searchByTags,
    searchByTitle,
    getAllVideo,
    history,
    watchList
};
