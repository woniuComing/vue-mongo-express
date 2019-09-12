const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const key = require('../../key');
const queryRules = (resource) => {
        return {
            'email': { $regex: resource.email, $options: '$i' },
            'date': { $gte: resource.date },
            'gender': resource.gender
        }
    }
    // const queryRules = {
    //     'email': { $regex: req.body.email, $options: '$i' },
    //     'date': { $gte: req.body.date },
    // }
router.post('/register', (req, res) => {
    //判断数据库里面有没有
    //没有的话写入数据库
    User.findOne({ email: req.body.email }).then(user => {

        if (user) {
            return res.status(200).json({ status: 0, msg: '邮箱已注册' })
        } else {
            let newuser = new User({
                    email: req.body.email,
                    password: req.body.password,
                    gender: req.body.gender
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
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            //如果找到，去匹配密码
            // expiresIn 过期事件可以是秒或者描述时间的字符串
            //例如： "2 days"，"10h"，"7d"
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const token = JWT.sign({ user: user }, key.secretKey, {
                        expiresIn: '1h'
                    });
                    res.status(200).json({
                        token: token,
                        status: 1
                    })
                } else {
                    return res.status(200).json({ msg: '密码错误', status: 0 })
                }
            })
        } else {
            //没有就返回用户不存在
            return res.status(200).json({ status: 0, msg: '用户不存在,请注册' })
        }
    }).catch(err => {
        console.log('login fail', err);
    })

})

router.post('/list', (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 5;
    let countNum = 0;
    let condition = {};
    for (let item in req.body) {
        if (item !== 'page' && req.body[item]) {
            condition[item] = queryRules(req.body)[item]
        }
    }
    // {
    //     $or : [ //多条件，数组
    //         {nick : {$regex : reg}},
    //         {email : {$regex : reg}}
    //     ]
    // },
    // {$or:
    //     [
    //      {$and:[{"state1":11},{"state2":22}]},{"value":{$gte:300}}
    //     ]
    //   }
    // condition = {
    //     $or: [
    //         {
    //             $and: [
    //                 { 'email': { $regex: req.body.email, $options: '$i' } },
    //                 { 'date': { $gte: req.body.date } }
    //             ]
    //         },
    //         { 'email': { $regex: req.body.email, $options: '$i' } },
    //         { 'date': { $gte: req.body.date } }
    //     ]
    // }
    // console.log(Object.values(req.body));
    // condition = {
    //     $and: [{
    //         $or: [
    //             { 'email': { $regex: req.body.email, $options: '$i' } },
    //             { 'date': { $gte: req.body.date } }
    //         ]
    //     }]
    // }
    // function handleQuery(queryConfig, ...params) {
    //     let [{ email, date }] = params;
    //     if (email) {
    //         condition = {
    //             [email]: { $regex: queryConfig.emailConfig, $options: '$i' }
    //         }
    //     } else if (date) {
    //         condition = {
    //             [date]: { $gte: queryConfig.dateConfig }
    //         }
    //     } else if (email && date) {
    //         condition = {
    //             [email]: { $regex: queryConfig.emailConfig, $options: '$i' },
    //             [date]: { $gte: queryConfig.dateConfig }
    //         }
    //     }
    // }
    // if (req.body.email && req.body.date) {
    //     handleQuery({ emailConfig: req.body.email, dateConfig: req.body.date }, { email: 'email', date: 'date' })
    // } else if (req.body.email && !req.body.date) {
    //     handleQuery({ emailConfig: req.body.email }, { email: 'email' })
    // } else if (req.body.date && !req.body.email) {
    //     handleQuery({ dateConfig: req.body.date }, { date: 'date' })
    // } else {

    // }
    //统计符合的个数
    User.countDocuments(condition, (err, res) => {
            if (err) {
                console.log('统计个数报错', err)
            } else {
                console.log(res);
                countNum = res;
            }
        })
        // let query = User.find(condition);
        // query.countDocuments((err, count) => {
        //         return (countNum = count);
        //     })
        // console.log('countNum:', countNum);
        // { 'password': 0 } 表示不输出该字段 1 输出该字段
    query = User.find(condition, { 'password': 0 });
    query
        .sort({ _id: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
    query.exec((err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 0, msg: '获取列表失败' })
            } else {
                // console.log(result);
                result.forEach(element => {
                    if (!element.gender && element.gender != 0) {
                        element.gender = -1;
                    }
                });
                res.status(200).json({
                    status: 1,
                    total: countNum,
                    data: result,
                    last_page: Math.ceil(countNum / limit),
                    currentPage: page
                })
            }
        })
        //去数据库查找
        // User.find({}, (err, arr) => {
        //     if (err) {
        //         console.log('查询失败')
        //         res.json({ status: 0, msg: 'query failed' })
        //     } else {
        //         console.log('查询成功');
        //         res.status(200).json({ status: 1, data: arr });
        //     }
        // })
})

router.post('/delete', (req, res) => {
    //拿到用户的邮箱，去数据库查找
    User.deleteOne({ 'email': req.body.email }).then(result => {
            // result.deletedCount 值为1 才是真正的删除
            if (result.deletedCount > 0) {
                res.status(200).json({ status: 1, msg: 'delete list successful' })
            } else {
                res.status(200).json({ status: 0, msg: "can't find this file" })
            }
        }).catch(err => {
            console.log(err);
            res.json({ status: 0, msg: 'delete list failed', data: err })
        })
        // 方法等同于
        // User.deleteOne({ 'email': req.body.email }, (err, result) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('successful', result)
        //     }
        // })

})

router.post('/update', (req, res) => {
    //根据_id 找到当前项
    User.update({ _id: req.body._id }, { $set: { email: req.body.email, gender: req.body.gender } }).then(result => {
        // console.log(result);
        res.status(200).json({ status: 1, msg: 'update successful' })
    }).catch(err => {
        // console.log(err);
        res.json({ status: 0, msg: 'update failed' })
    })
})
module.exports = router;