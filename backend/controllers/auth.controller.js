
const User = require('../models/User');
const createError = require('../error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const signUp = async (req, res, next) => {
    try {
        const newUser = new User(req.body)
        // console.log(req.body);
        await newUser.save()
        res.status(200).send("User has been created!")
    } catch (error) {
        // next(createError(404, "Duplicate Email"))
        next(error)
    }
};
const signIn = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (!user) return next(createError(404, "User Not Found!"))
        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) return next(createError(404, "Wrong Credentials!"));
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...otherDetails } = user._doc
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(otherDetails)

    } catch (error) {
        // next(createError(404, "Duplicate Email"))
        next(error)
    }
}
const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(user._doc)
        } else {
            const newUser = new User({
                ...req.body, fromGoogle: true
            })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(savedUser._doc)
        }


    } catch (error) {
        // next(createError(404, "Duplicate Email"))
        next(error)
    }
}

const logOut = (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.json('LogOut')
    } catch (error) {
        console.log(error);

    }
}


module.exports = {
    signUp, signIn, googleAuth, logOut
}