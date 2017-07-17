"use strict";
const service = require("../services");
module.exports = {
    /**
     * 分享赚钱的首页
     */
    index: async (req, res) => {
        let { taskTag } = req.query;
        taskTag = taskTag ? taskTag : false;
        let taskTags = await service.db.taskTagModel.find().exec();
        let tasks = [];
        if (taskTag) {
            tasks = await service.db.taskModel.find({ taskTag }).limit(10).exec();
        }
        else {
            tasks = await service.db.taskModel.find().limit(10).exec();
        }
        await res.render('share/index', { taskTag, tasks, taskTags });
    },
    recruitStudent: async (req, res) => {
        await res.render('share/recruit-student');
    },
    /**个人中心 */
    personCenter: (req, res) => {
        res.render('share/person-center');
    },
    /**完善信息 */
    fullInfo: (req, res) => {
        res.render('share/full-info');
    },
    /**文章详情页面 */
    detail: (req, res) => {
        res.render('share/detail');
    },
    publish: (req, res) => {
        res.render('share/publish');
    },
    /**商户中心 */
    shopCenter: (req, res) => {
        res.render('share/shop-center');
    }
};
