import express = require('express');
import service = require('./services');
export type Request = express.Request;
export type Response = express.Response;
export type RequestHandler = express.RequestHandler;
export interface IRoute {

    doAction: (action: string, method: string) => RequestHandler;
}

export abstract class BaseRoute implements IRoute {
    GET = 'get';
    POST = 'post';
    DELETE = 'delete';
    PUT = 'put';
    service = service;
    abstract doAction(action: string, method: string): RequestHandler;


}


export class RouteBuilder {
    static buildRoute(routeClass: new () => BaseRoute): RequestHandler {
        return (req: express.Request, res: express.Response) => {
            var route = new routeClass();
            route.doAction(req.params.action, req.method.toLowerCase()).call(route, req, res)
        }
    }

}

