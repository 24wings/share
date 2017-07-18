import service = require('../services');
import express = require('express');


export ={
    /**
     * 分享赚钱的首页
     */
    index: async (req: express.Request, res: express.Response) => {

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
        } else {
            tasks = await service.db.taskModel.find().limit(100).exec();
        }
        await res.render('share/index', { taskTag, tasks, taskTags });
    },
    recruitStudent: async (req: express.Request, res: express.Response) => {
        await res.render('share/recruit-student');
    },
    /**个人中心 */
    personCenter: (req: express.Request, res: express.Response) => {
        let user = req.session.user;
        console.log(user);
        res.render('share/person-center', {
            user
        });
    },
    /**完善信息 */
    fullInfo: (req: express.Request, res: express.Response) => {
        res.render('share/full-info')
    },
    /**文章详情页面 */
    detail: (req: express.Request, res: express.Response) => {

        res.render('share/detail')
    },
    publishPage: async (req: express.Request, res: express.Response) => {
        let taskTags = await service.db.taskTagModel.find().exec();
        res.render('share/publish', { taskTags })
    },
    /**商户中心 */
    shopCenter: (req: express.Request, res: express.Response) => {
        res.render('share/shop-center')
    },
    /**
     * 检查openid是否存在,若用户已经存在,则登陆,若用户不存在,则创建新用户
     * 若有上级parentId存在则作为用户的师傅
     */
    checkOpenIdExisit: (req: express.Request, res: express.Response) => {

    },
    publishTask: async (req: express.Request, res: express.Response) => {
        let { title, content, imageUrl, taskTag, shareMoney, totalMoney, websiteUrl } = req.body;
        let newTask = await new service.db.taskModel({ title, taskTag, content, imageUrl, totalMoney, shareMoney, websiteUrl }).save();
        res.redirect('/share');
    },

    payTaskMoney: async (req: express.Request, res: express.Response) => {
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

    taskDetail: async (req: express.Request, res: express.Response) => {
        var params = await service.wechat.getJSSDKApiParams({ url: 'http://' + req.hostname + req.originalUrl });
        var userId = req.query._id;
        let task = await service.db.taskModel.findById(req.params._id).exec();
        let user = await service.db.userModel.findById(_id).populate('parent').exec();;
        var ip = service.tools.pureIp(req.ip);// 纯ip
        var isHaveVisited = task.ips.some(visitedIp => {
            return ip == visitedIp;
        });
        // 新的观看的人 
        if (!isHaveVisited) {
            // 任务 增加点击数量,ip访问数量,任务消耗数量
            task.update({ $inc: { clickNum: 1 }, $push: { ips: ip }, $set: { totalMoney: task.totalMoney - task.shareMoney } }).exec();
            //发布任务的人获得奖金 上级 5%   上上级 10% 上上上级 15%
            var taskAllMoney = task.shareMoney;
            if (user) {
                /**
                 * 有师傅
                 */
                if (user.parent) {
                    var parents = [];
                    // 有师傅
                    parents.push(user.parent);
                    await user.parent.populate('parent').execPopulate();

                    if (user.parent.parent) {
                        parents.push(user.parent.parent);
                        await user.parent.parent.populate('parent').execPopulate();
                    }
                    // 三级师傅
                    if (user.parent.parent.parent) parents.push(user.parent.parent.parent)

                    // 三级师傅的算法
                    console.log(parents);

                } else {
                    //一个师傅都没有
                    console.log(`一个师傅都没有
                     totalMoney: ${user.totalMoney + taskAllMoney},
                            todayMoney: ${user.todayMoney + taskAllMoney},
                            historyMoney: ${user.historyMoney + taskAllMoney}
                    
                    `)
                    await user.update({
                        $set: {
                            totalMoney: user.totalMoney + taskAllMoney,
                            todayMoney: user.todayMoney + taskAllMoney,
                            historyMoney: user.historyMoney + taskAllMoney
                        }
                    }).exec();

                }


            }

        } else {
            console.log('没有_id,没有推广人')
        }

        /**
         * 若有推广人
         */






        await res.render('share/detail', { task, params });
    }
}
