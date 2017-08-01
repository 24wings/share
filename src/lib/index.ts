import express = require('express');
import service = require('../services');

import fs = require('fs');
import path = require('path');
export var VIEWPATH = Symbol('VIEWPATH');
export var SERVICEPATH = Symbol('SERVICEPATH');
export var CHECKQUERY = Symbol('CHECKQUERY');
export var CHECKBODY = Symbol('CHECKBODY');

/**
 * 
 * 装饰器
 * 如 @Views('project-manage-admin')　
 * 在 ProjectManageAdmin上后,调用 this.render('index')自动渲染视图文件夹views下的project-manage-admin/index.html
 * 
 * 
 */



export namespace Core {
    export namespace Route {
        export type Request = express.Request;
        export type Response = express.Response;
        export type RequestHandler = express.RequestHandler;
        export function Controller(config: {
            service: string,
            viewPath: string
        }) {
            return (target: RouteClass) => {
                target.prototype[VIEWPATH] = config.viewPath;
                target.prototype[SERVICEPATH] = config.service
            };
        }



        export interface IRoute {
            req: Request;
            res: Response;

            /**
             * 请求之前的中间件
             */
            before: RequestHandler;
            /**
             * 请求之后的中间件
             */
            after: RequestHandler;
            doAction: (action: string, method: string, next: RequestHandler) => RequestHandler;
        }


        export class RouteBuilder {

            static route = new Map<string, BaseRoute & IRoute>();
            /** 
             * 
             * 构建路由
             */
            static addRoute(routeClass: RouteClass): Map<string, BaseRoute & IRoute> {
                let service = routeClass.prototype[SERVICEPATH];
                if (this.route.get(service)) {
                    throw Error('重复添加路由器' + service);
                } else {
                    let routeObj = new routeClass();
                    this.route.set(service, routeObj)
                    console.log('添加路由', service)
                }
                // RouteBuilder.route[SERVICEPATH] = new routeClass();

                // this.route.get()

                return this.route;

            }

            static getRoute() {
                var ctrl = {
                    service: service,
                    CONFIG: service.CONFIG,
                    db: service.db,
                    GET: 'get',
                    POST: 'POST',
                }

                return [
                    //before
                    (req, res, next) => {
                        let routeObj = this.route.get(req.params.service);
                        if (routeObj) {
                            console.log(`
                                service:${req.params.service}
                                action:${req.params.action}
                                
                                `)
                            // console.log(routeObj);
                            let temp = Object.assign({}, ctrl, { req, res, next, render: (filename, data) => res.render(`${routeObj[VIEWPATH]}/${filename}`, data) });
                            routeObj.before.bind(temp)(req, res, next);
                        } else {
                            throw Error('路由不存咋')
                        }

                    },
                    (req: Request, res: Response, next: RequestHandler) => {
                        let routeObj = this.route.get(req.params.service);
                        if (routeObj) {
                            // 参数检验
                            let temp = Object.assign({}, ctrl, {
                                req,
                                res,
                                next,
                                render: (filename, data) => res.render(`${routeObj[VIEWPATH]}/${filename}`),
                                display: (data?) => res.render(`${routeObj[VIEWPATH]}/${req.params.action}`, data)
                            });
                            routeObj.doAction(req.params.action, req.method.toLowerCase(), next).bind(temp)(req, res, next);
                        } else {
                            throw Error('路由不存在');
                        }
                        // let query = method.prototype[CHECKQUERY];

                        // console.log(query);
                        // method(query);
                    }, (req, res, next) => {
                        let routeObj = this.route.get(req.params.service);
                        if (routeObj) {
                            let temp = Object.assign({}, ctrl, { req, res, next, render: (filename, data) => res.render(`${routeObj[VIEWPATH]}/${filename}`, data) });
                            routeObj.after.bind(temp)(req, res, next);

                        } else {
                            throw Error('路由不存在')
                        }

                    }];
            }

            static scannerRoutes(dirPath: string) {
                let state = fs.lstatSync(dirPath);
                if (state.isDirectory()) {
                    let files = fs.readdirSync(dirPath);
                    files.forEach(filename => {
                        let aboFile = path.resolve(dirPath, filename);

                        let relative = path.relative(__dirname, aboFile);
                        // console.log('文件', aboFile, __dirname, relative);
                        relative = relative.replace(/\\/g, '/');

                        let routePath = './' + relative;
                        console.log('路由文件:', routePath);
                        let routeClass: RouteClass = require(routePath).default;
                        // console.log('routeClass', routeClass);
                        this.addRoute(routeClass)
                    });

                    return this.getRoute();

                } else {
                    throw Error('please input a  directiory to be a scannerRoute Directory');
                }


            }
            static buildMiddle(): RequestHandler[] {
                return;

            }

        }

        export class BaseRoute extends Object {
            GET = 'get';
            POST = 'post';
            DELETE = 'delete';
            PUT = 'put';
            isGet: boolean;
            isPost: boolean;
            public service = service;
            public db = service.db;
            public CONFIG = service.CONFIG;
            res: Response;
            req: Request;
            next: express.NextFunction;
            render: (filename: string, data?: any) => void;
            /**
             * 
             * 根据 service 自动渲染    /:service/:action.thml
             */
            display: (data?) => void;
            doAction(action, method, next) {
                return next;
            }

            constructor() {

                super();
                delete this.service;
                delete this.db;
                delete this.CONFIG;

            }

        }

        export type RouteObject = BaseRoute & IRoute;

        export type RouteClass = new () => RouteObject;





    }

    export namespace Check {
        export function Query(key: string) {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                let method: Function = target[propertyKey];
                method.prototype[CHECKQUERY] = key;


            }
        }
        export function Body() {

        }
        export interface CheckResult {
            ok: boolean;
            errorMsg: string;
        }

    }

    export namespace Forms {

    }
}






