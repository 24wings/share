"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
//登录页
let default_1 = class extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
        switch (action) {
            case 'login': {
                return this.login;
            }
            case 'register':
                switch (method) {
                    case 'post': return this.loginDo; //注册 
                    default: return this.loginDo;
                }
            case 'index': return this.index;
        }
    }
    /* 账户：手机号码（phone）
     * 设置密码：password
     * 确认密码：password
     * 地区选择：city
     * 验证码：  code
     * 手机验证: verification
     *
     */
    async loginDo() {
    }
    login() {
        this.res.json({
            ok: true,
            data: 'uer'
        });
        // this.res.json({
        // ok:false,
        // data:'用户名'
        // })
    }
    before() {
        this.next();
    }
    after() { }
    index() {
        this.display();
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'advert',
        viewPath: 'advert'
    })
], default_1);
exports.default = default_1;
