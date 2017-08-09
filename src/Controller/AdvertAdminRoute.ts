import { Core } from '../lib';

//登录页

@Core.Route.Controller({
    service: 'advert',
    viewPath: 'advert'
})

export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'login': {
                return this.login;
            }
            case 'register':
                switch (method) {
                    case 'post': return this.loginDo;//注册 
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

    async  loginDo() {



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




}

