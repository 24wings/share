"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const fs = require("fs");
const path = require("path");
let ShareAdminRoute = class ShareAdminRoute extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
        switch (action) {
            case 'banner-list': return this.bannerList; //分页
            case 'add-banner': return this.addBanner;
            case 'banner':
                switch (method) {
                    case 'get': return this.bannerDetail;
                    case 'put': return this.bannerUpdate;
                    case 'delete': return this.bannerDelete;
                }
            case 'toggle-banner-active': return this.toggleBannerActive;
            case 'office-task':
                switch (method) {
                    case 'get': return this.officeTaskGet;
                    case 'post': return this.officeTaskPost;
                    case 'put': return this.officeTaskPut;
                    case 'delete': return this.officeTaskDelete;
                }
                ;
            case 'uploadBase64': return this.uploadBase64;
            case 'taskTag':
                switch (method) {
                    case 'get': return this.getTaskTag;
                    case 'post': return this.postTaskTag;
                    default: return this.getTaskTag;
                }
            case 'task-record':
                switch (method) {
                    case 'get': return this.getTaskRecord;
                }
                ;
            case 'rest': switch (method) {
                case 'get': return this.restGet;
                case 'post': return this.restPost;
                case 'put': return this.restPut;
                case 'delete': return this.restDelete;
            }
            default: return this.index;
        }
    }
    async restGet() {
        //
        let { model, page = 0, pageSize = 10, keyword, key, _id } = this.req.query;
        if (this.db[model]) {
            let table = this.db[model];
            //详情
            if (_id) {
                let item = await table.findById(_id);
                this.res.json({ ok: true, data: item });
            }
            else {
                // 查询搜索
                if (keyword && key) {
                }
                else {
                }
            }
        }
        else {
            this.res.json({
                ok: true,
                data: '数据库表不存在'
            });
        }
    }
    restPost() { }
    restPut() { }
    restDelete() { }
    async getTaskRecord() {
        let { page = 0, pageSize = 10 } = this.req.query;
        if (typeof pageSize == 'string')
            pageSize = parseInt(pageSize);
        let data = await this.db.taskRecordModel.find().skip(page * pageSize).limit(pageSize).populate('shareDetail.user').exec();
        let count = await this.db.taskRecordModel.count({}).exec();
        data['count'] = count;
        this.res.json({
            ok: true,
            data: { rows: data, count }
        });
    }
    async bannerDelete() {
        let banner = await this.db.bannerModel.findByIdAndRemove(this.req.query._id).exec();
        this.res.json({
            ok: true, data: banner
        });
    }
    async getTaskTag() {
        let { _id, page, pageSize } = this.req.query;
        if (_id) {
            let taskTag = await this.db.taskTagModel.findById(_id).exec();
            this.res.json({ ok: true, data: taskTag });
        }
        else {
        }
    }
    postTaskTag() {
    }
    async uploadBase64() {
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
            });
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
        }
        else {
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
        });
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
        });
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
};
ShareAdminRoute = __decorate([
    lib_1.Core.Route.Controller({
        service: 'share-server',
        viewPath: 'share-server'
    })
], ShareAdminRoute);
exports.default = ShareAdminRoute;
