
import service = require('../services');
import express = require('express');

export ={
    /**
     * 分享赚钱的首页
     */
    index: async (req: express.Request, res: express.Response) => {
        let { taskTag } = req.query;
        taskTag = taskTag ? taskTag : false;

        let taskTags = await service.db.taskTagModel.find().exec();
        let tasks = [];
        if (taskTag) {
            tasks = await service.db.taskModel.find({ taskTag }).limit(10).exec();
        } else {
            tasks = await service.db.taskModel.find().limit(10).exec();
        }
        await res.render('share/index', { taskTag, tasks, taskTags });
    },
    recruitStudent: async (req: express.Request, res: express.Response) => {
        await res.render('share/recruit-student');
    },
    /**个人中心 */
    personCenter: (req: express.Request, res: express.Response) => {
        res.render('share/person-center');
    },
    /**完善信息 */
    fullInfo: (req: express.Request, res: express.Response) => {
        res.render('share/full-info')
    },
    /**文章详情页面 */
    detail: (req: express.Request, res: express.Response) => {
        res.render('share/detail')
    },
    publish: (req: express.Request, res: express.Response) => {
        res.render('share/publish')
    },
    /**商户中心 */
    shopCenter: (req: express.Request, res: express.Response) => {
        res.render('share/shop-center')
    }

}
