"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
let default_1 = class extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
        switch (action) {
            case 'publish-platform-task': return this.publishPlatformTask;
            default: return this.index;
        }
    }
    publishPlatformTask() {
        this.display();
    }
    before() {
        this.next();
    }
    after() {
    }
    index() {
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'service',
        viewPath: 'service'
    })
], default_1);
exports.default = default_1;
