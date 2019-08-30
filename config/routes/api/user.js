const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../../models/user');
router.post('/register', (req, res) => {
    //判断数据库里面有没有
    //没有的话写入数据库
    User.findOne({ email: req.body.email }).then(user => {

        if (user) {
            return res.status(200).json({ status: 0, msg: '邮箱已注册' })
        } else {
            let newuser = new User({
                    email: req.body.email,
                    password: req.body.password
                })
                //密码加密处理
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newuser.password, salt, (err, hash) => {
                    newuser.password = hash;
                    //写入数据库
                    newuser.save()
                        .then(user => {
                            console.log('写入成功')
                            res.json({ data: user, status: 1 })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            })

        }
    })
})

router.post('/login', (req, res) => {
    //先去数据库里面找
    //没有就返回用户不存在
    //有的话就去检测账户密码是否匹配
})

module.exports = router;