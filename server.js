const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/backend';
require('./config/express');
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('链接成功')
    })
    .catch(err => {
        console.log(err);
    })