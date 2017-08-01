import { Core } from '../lib';

@Core.Route.Controller({
    service: 'service',
    viewPath: 'service'
})
export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
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
}