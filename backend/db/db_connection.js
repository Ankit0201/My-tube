const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const connect = () => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('connected DB');
    }).catch(err => {
        console.log(err, "errrr");
    })
}
connect()
// console.log(process.env);
