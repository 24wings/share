"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service = require("./services");
class BaseRoute {
    constructor() {
        this.GET = 'get';
        this.POST = 'post';
        this.DELETE = 'delete';
        this.PUT = 'put';
        this.service = service;
    }
}
exports.BaseRoute = BaseRoute;
class RouteBuilder {
    static buildRoute(routeClass) {
        return (req, res) => {
            var route = new routeClass();
            route.doAction(req.params.action, req.method.toLowerCase()).call(route, req, res);
        };
    }
}
exports.RouteBuilder = RouteBuilder;
