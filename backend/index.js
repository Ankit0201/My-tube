const express = require('express');
const app = express()
require('./db/db_connection');
const userRoutes = require('./routes/user')
const videoRoutes = require('./routes/video')
const commentRoutes = require('./routes/comment')
const auth = require('./routes/auth')
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', auth)
app.use('/api/users', userRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/comments', commentRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })

})


app.listen(8000, () => {
    console.log("Server Connected");
})