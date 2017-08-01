"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
let AdversterRoute = class AdversterRoute extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
        switch (action) {
            case 'login':
                switch (method) {
                    case 'get': return this.login;
                    case 'post': return this.loginDo;
                    default: return this.loginDo;
                }
            case 'index': return this.index;
        }
    }
    async loginDo() {
        let { phone, password } = this.req.body;
        let user = await this.db.userModel.findOne({ phone }).exec();
        if (user) {
            this.req.session.user = user;
            this.res.locals.user = user;
            this.res.redirect('/adverster/index');
        }
        else {
            this.display({ errorMsg: '用户名或密码错误' });
        }
    }
    before() {
        if (this.req.session.user || this.req.params.action == 'login') {
            this.next();
        }
        else {
            this.res.redirect('/adverster/login');
        }
    }
    after() { }
    index() {
        this.display();
    }
    login() {
        this.display();
    }
};
AdversterRoute = __decorate([
    lib_1.Core.Route.Controller({
        service: 'adverster',
        viewPath: 'adverster'
    })
], AdversterRoute);
exports.default = AdversterRoute;
