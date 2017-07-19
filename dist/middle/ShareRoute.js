"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("../route");
class ShareRoute extends route_1.BaseRoute {
    doAction(action, method) {
        switch (action) {
            case 'home':
                return this.home;
            default:
                return this.home;
        }
    }
    async home(req, res) {
        let { taskTag, openid } = req.query;
        taskTag = taskTag ? taskTag : false;
        let user = req.session.user;
        console.log('user', user);
        if (openid) {
            console.log('openid :', openid);
            user = await this.service.db.userModel.findOne({ openid }).exec();
        }
        let taskTags = await this.service.db.taskTagModel.find().exec();
        let tasks = [];
        if (taskTag) {
            tasks = await this.service.db.taskModel.find({ taskTag }).limit(100).exec();
        }
        else {
            tasks = await this.service.db.taskModel.find().limit(100).exec();
        }
        await res.render('share/index', { taskTag, tasks, taskTags, user });
    }
    async recruitStudent(req, res) {
        var user = req.session.user;
        var authUrl = await this.service.wechat.getAuthorizeURL({ parent: req.session.user._id.toString() });
        await res.render('share/recruit-student', { authUrl, user });
    }
}
exports.ShareRoute = ShareRoute;
