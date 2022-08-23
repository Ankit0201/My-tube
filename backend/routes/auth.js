const express = require('express');
const { signUp, signIn, googleAuth, logOut } = require('../controllers/auth.controller');

const router = express.Router();
// CREATE A USER
router.post("/signup", signUp)
// SIGN IN
router.post("/signin", signIn)
// GOOGLE AUTH
router.post("/google", googleAuth)
router.post("/logOut", logOut)
module.exports = router