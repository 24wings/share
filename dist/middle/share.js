"use strict";
const service = require("../services");
module.exports = {
    /**
     * 分享赚钱的首页
     */
    index: async (req, res) => {
        let { taskTag, openid } = req.query;
        taskTag = taskTag ? taskTag : false;
        let user = req.session.user;
        console.log('user', user);
        if (openid) {
            console.log('openid :', openid);
            user = await service.db.userModel.findOne({ openid }).exec();
        }
        let taskTags = await service.db.taskTagModel.find().exec();
        let tasks = [];
        if (taskTag) {
            tasks = await service.db.taskModel.find({ taskTag }).limit(100).exec();
        }
        else {
            tasks = await service.db.taskModel.find().limit(100).exec();
        }
        await res.render('share/index', { taskTag, tasks, taskTags });
    },
    recruitStudent: async (req, res) => {
        await res.render('share/recruit-student');
    },
    /**个人中心 */
    personCenter: (req, res) => {
        let user = req.session.user;
        console.log(user);
        res.render('share/person-center', {
            user
        });
    },
    /**完善信息 */
    fullInfo: (req, res) => {
        res.render('share/full-info');
    },
    /**文章详情页面 */
    detail: (req, res) => {
        res.render('share/detail');
    },
    publishPage: async (req, res) => {
        let taskTags = await service.db.taskTagModel.find().exec();
        res.render('share/publish', { taskTags });
    },
    /**商户中心 */
    shopCenter: (req, res) => {
        res.render('share/shop-center');
    },
    /**
     * 检查openid是否存在,若用户已经存在,则登陆,若用户不存在,则创建新用户
     * 若有上级parentId存在则作为用户的师傅
     */
    checkOpenIdExisit: (req, res) => {
    },
    publishTask: async (req, res) => {
        let { title, content, imageUrl, taskTag, shareMoney, totalMoney, websiteUrl } = req.body;
        let newTask = await new service.db.taskModel({ title, taskTag, content, imageUrl, totalMoney, shareMoney, websiteUrl }).save();
        res.redirect('/share');
    },
    payTaskMoney: async (req, res) => {
        let ip = req.ip.indexOf('::ffff:') == 0 ? req.ip.substring(req.ip.indexOf('::ffff:') + 7) : req.ip;
        console.log(ip);
        var payargs = await service.wechat.wechatPay({
            body: '支付活动费用',
            spbill_create_ip: ip,
            openid: req.session.user.openid,
            trade_type: 'JSAPI',
            total_fee: req.body.totalMoney * 100, attach: '任务费用', out_trade_no: 'kfc' + (+new Date)
        });
        res.json({ ok: true, data: payargs });
    },
    taskDetail: async (req, res) => {
        var _id = req.params._id;
        let task = await service.db.taskModel.findById(_id).exec();
        await res.render('share/detail', { task });
    }
};
