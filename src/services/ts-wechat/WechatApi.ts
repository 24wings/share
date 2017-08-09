import https = require('https');
import tool from './WechatTool';

/**
 * access_token官方文档    https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
 */
export default class {
    URLS = {
        //&appid=APPID&secret=APPSECRET
        accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
        //access_token=ACCESS_TOKEN&type=jsapi
        ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=api'
    }

    //私有的token
    private token: {
        access_token: string,
        expires_in: number,
        lastModifyTime: number
    }
    = {
        access_token: '',
        expires_in: 0,
        lastModifyTime: 0
    }

    private ticket: {
        ticket: string,
        expires_in: number,
        lastModifyTime: number
    } = {
        ticket: '',
        expires_in: 0,
        lastModifyTime: 0
    }



    //若不传入token,则自动调用底层方法获取token,若传入token,则使用token
    async getTicket(token?: string) {
        if (!token) { token = await this.getAccessToken(); }
        let ticket = await tool.httpsGet(this.URLS.ticket + `access_token=${token}`);
        return ticket;
    }

    get isTokenInvalid(): boolean {
        return !!this.token.access_token && new Date().getTime() <= this.token.lastModifyTime + this.token.expires_in * 1000 && !!this.token.lastModifyTime;
    }


    constructor(private appId: string, private appSecrt: string) { }
    /**
     * 自动缓存access_token,开心大胆的用吧
     */
    async getAccessToken(): Promise<string> {
        if (this.isTokenInvalid) {
            return this.token.access_token;
        } else {
            let tokenStr = await tool.httpsGet(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appId}&secret=${this.appSecrt}`);
            let token: { access_token: string, expires_in: string } = JSON.parse(tokenStr);
            this.token.access_token = token.access_token;
            this.token.lastModifyTime = new Date().getTime();
            this.token.expires_in = parseInt(token.expires_in);
            return this.token.access_token;
        }
    }


}