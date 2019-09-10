const express = require('express');
const bodyParser = require('body-parser');
const JWT = require('jsonwebtoken');
const { secretKey } = require('./key');
const user = require('./routes/api/user');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '/src/public')))
    //提供静态资源文件
    //app.use() 接收两个参数，
    // 第一个默认是根路径：‘/’,如果不传，所有的请求都会经过这个中间件。
    // 第二个参数是callback
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', (req, res, next) => {
    let url = req.url;
    if (url.indexOf('/users/login') != -1 || url.indexOf('/users/register') != -1) {
        next();
    } else {
        if (!req.headers['token'] || req.headers['token'] === 'null') {
            res.status(401).json({ status: 0, msg: 'token 不存在' })
        } else {
            try {
                //解析一下token
                const token = req.headers['token'];
                JWT.verify(token, secretKey, (err, data) => {
                    // console.log('解析验证token', err, data);
                    if (err) {
                        //验证失败
                        return res.status(401).json({ status: 0, msg: 'token 已过期' })
                    } else {
                        //验证成功
                        next();
                    }
                })
            } catch (error) {
                return res.status(401).json({ status: 0, msg: 'token 解析错误', result: error })
            }
        }
    }
})

app.use('/api/users', user);
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})