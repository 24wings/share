import { Core } from '../lib';

//登录页

@Core.Route.Controller({
    service: 'advert',
    viewPath: 'advert'
})

export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'register':
                switch (method) {
                    case 'get': return this.login;
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

        let { phone, password, city, code, verification } = this.req.body;
        let phones = await this.db.advertModel.findOne({ phone }).exec();

        if (phones) {
            this.display({ errorMsg: '手机用户已存在' });
            this.next();
        } else {
            let phones = await new this.db.advertModel({ phone, password }).save();//添加入库
            // this.res.redirect();
        }


    }
    before() {
        // if (this.req.session.user || this.req.params.action == 'register') {
        //     this.next();
        // } else {
        //     this.res.redirect('/advert/register');
        // }
    }
    after() { }

    index() {
        this.display();
    }

    login() {


        this.display({});
    }



}

