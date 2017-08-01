import { Core } from '../lib';



@Core.Route.Controller({
    service: 'adverster',
    viewPath: 'adverster'
})
export default class AdversterRoute extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
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
    async  loginDo() {
        let { phone, password } = this.req.body;
        let user = await this.db.userModel.findOne({ phone }).exec();
        if (user) {
            this.req.session.user = user;
            this.res.locals.user = user;
            this.res.redirect('/adverster/index');
        } else {
            this.display({ errorMsg: '用户名或密码错误' });
        }

    }

    before() {
        if (this.req.session.user || this.req.params.action == 'login') {
            this.next();
        } else {
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

}