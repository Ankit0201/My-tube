const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
        imgUrl: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        views: {
            type: [String]
        },
        tags: {
            type: [String],
        },
        likes: {
            type: [String],
        },
        dislikes: {
            type: [mongoose.Schema.Types.ObjectId],
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("Video", videoSchema);
