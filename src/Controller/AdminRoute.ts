import { Core } from '../lib';
import fs = require('fs');
import path = require('path');
@Core.Route.Controller({
    service: 'admin',
    viewPath: 'admin'
})
export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {

            default: return this.index;
        }
    }


    before() {
        this.next();
    }
    after() {

    }
    index() {
        fs.readFile(path.resolve(__dirname, '../../public/index.html'), (err, data) => {
            if (err) console.log(err);
            this.res.end(data);
        })
    }
}