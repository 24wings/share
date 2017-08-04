import { Core } from '../lib';
import fs = require('fs');
import path = require('path');
@Core.Route.Controller({
    service: 'share-server',
    viewPath: 'share-server'
})
export default class ShareAdminRoute extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'banner-list': return this.bannerList;//分页
            case 'add-banner': return this.addBanner;
            case 'banner':
                switch (method) {
                    case 'get': return this.bannerDetail;
                    case 'put': return this.bannerUpdate;
                }
            case 'toggle-banner-active':
                return this.toggleBannerActive;

            case 'office-task':
                switch (method) {
                    case 'get': return this.officeTaskGet;
                    case 'post': return this.officeTaskPost;
                    case 'put': return this.officeTaskPut;
                    case 'delete': return this.officeTaskDelete;
                };
            case 'uploadBase64': return this.uploadBase64;
            case 'taskTag':
                switch (method) {
                    case 'get': return this.getTaskTag;
                    case 'post': return this.postTaskTag;
                    default: return this.getTaskTag
                }
            default: return this.index;
        }
    }
    async getTaskTag() {
        let { _id, page, pageSize } = this.req.query;
        if (_id) {
            let taskTag = await this.db.taskTagModel.findById(_id).exec();
            this.res.json({ ok: true, data: taskTag });
        } else {

        }

    }

    postTaskTag() {

    }
    async  uploadBase64() {
        let base64 = this.req.body.base64;
        var ctrl = this;
        function uploadFile(file, filename) {
            return new Promise((resolve, reject) => {
                if (file.indexOf('base64,') != -1) {
                    file = file.substring(file.indexOf('base64,') + 7);
                }
                let randomFilename = new Date().getTime() + filename;
                let distpath = path.resolve(ctrl.service.CONFIG.uploadDir + '/' + randomFilename);

                fs.writeFile(distpath, new Buffer(file, 'base64'), (err) => {
                    err ? resolve(false) : resolve('/upload/' + randomFilename);
                });
            })
        }
        let url = await uploadFile(base64, this.req.body.filename || 'test.png');
        console.log('上传图片:' + url);
        this.res.json({ ok: true, data: this.service.CONFIG.IP + url });

    }

    async officeTaskGet() {
        let { _id } = this.req.query;


        if (_id) {
            let officeTask = await this.db.taskModel.findById(_id).exec();
            this.res.json({
                ok: true,
                data: officeTask
            });
        } else {
            let office = await this.service.getOfficeUser();
            let officeTasks = await this.db.taskModel.find({ publisher: office._id.toString() }).exec();
            this.res.json({
                ok: true,
                data: officeTasks
            });
        }
    }
    async officeTaskPost() {
        let office = await this.service.getOfficeUser();
        let task = this.req.body;
        task.publisher = office._id;
        task.openid = 'admin';
        let newTask = await new this.db.taskModel(task).save();
        this.res.json({
            ok: true,
            data: newTask
        })
    }
    async officeTaskPut() {

        let modifyAction = await this.db.taskModel.findByIdAndUpdate(this.req.query._id, this.req.body).exec();
        this.res.json({
            ok: true,
            data: modifyAction
        });
    }
    async officeTaskDelete() {
        let delAction = await this.db.taskModel.findByIdAndRemove(this.req.query._id).exec();
        this.res.json({
            ok: true,
            data: delAction
        });

    }
    async toggleBannerActive() {
        let banner = await this.db.bannerModel.findById(this.req.query._id).exec();
        let update = banner.update({ active: !banner.active }).exec();
        this.res.json({
            ok: true,
            data: update
        })
    }
    async bannerDetail() {
        let { _id } = this.req.query;
        let banner = await this.db.bannerModel.findById(_id).populate('task').exec();
        this.res.json({ ok: true, data: banner });
    }

    async bannerUpdate() {
        let { _id } = this.req.query;
        let { sort, bannerImg } = this.req.body;
        let newBanner = await this.db.bannerModel.findByIdAndUpdate(_id, { sort, bannerImg }).exec();
        this.res.json({ ok: true, data: newBanner });

    }

    before() {
        this.next();
    }
    after() {

    }
    async addBanner() {
        let { taskId } = this.req.query;

        let newBanner = await new this.db.bannerModel({ task: taskId }).save();
        this.res.json({ ok: true, data: newBanner });

    }

    async bannerList() {
        let banners = await this.db.bannerModel.find().populate('task').exec();
        this.res.json({ ok: true, data: { banners, count: banners.length } });
    }


    index() {

    }


}