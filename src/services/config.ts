import path = require('path');
import fs = require('fs');
import { WechatOauth, WechatPay, WechatApi } from './ts-wechat'


export const CONFIG = {
    port: 8080,
    adverster: {

    },
    //随机字符串
    randomStr: 'random',
    /**
     * 商户名称
     */
    wechatName: '武汉铭禄科技有限公司',
    oldAuth: 'shop.xxbuy.net',
    uploadDir: path.resolve(__dirname, '../../public/upload'),
    newAuth: '',
    domain: 'http://wq8.youqulexiang.com',
    oauthPath: '/wechat/oauth',
    IP: 'http://47.92.87.28',
    wechat: {
        token: 'sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR',
        appid: 'wx8bdcc982b8477839',
        appsecret: 'ffe69aaff2487a7f1557f4e2e33952e6',
        encodingAESKey: 'A985jVM2v8QeiVHi85ILizNeLNqjI68yHmUjn46I2JM',
        checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
    },
    wechatPay: {
        partnerKey: "minglu12minglu12minglu12minglu12",
        appId: 'wx8bdcc982b8477839',
        mchId: "1447732502",
        notifyUrl: "http://wq8.youqulexiang.com/payment/",
        pfx: fs.readFileSync(path.resolve(__dirname, '../../temp/apiclient_cert.p12'))
    },
    wechatPayment: {
        appid: 'wx8bdcc982b8477839',
        mch_id: '1447732502',
        apiKey: 'minglu12minglu12minglu12minglu12', //微信商户平台API密钥 
        notify_url: 'http://wq8.youqulexiang.com/payment/',
        trade_type: 'APP', //APP, JSAPI, NATIVE etc. 
        pfx: fs.readFileSync(path.resolve(__dirname, '../../temp/apiclient_cert.p12')) //微信商户平台证书 (optional，部分API需要使用) 

    },
    servicePayment: {
        much_appId: '1485776572',
    },
    jssdk: {
        "wechatToken": "sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR",
        "appId": "wx07a1ef24ca488840",
        "appSecret": "ffe69aaff2487a7f1557f4e2e33952e6",
    },
    // wechatClient: ''
    // 静态文件服务器
    publicDirs: [path.resolve(__dirname, '../../public')]
}


export default new class {
    port: 8080;
    private wechat = {
        appid: 'wx8bdcc982b8477839',
        token: 'sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR',
        appsecret: 'ffe69aaff2487a7f1557f4e2e33952e6',
        encodingAESKey: 'A985jVM2v8QeiVHi85ILizNeLNqjI68yHmUjn46I2JM',
        checkSignature: true,
        apiKey: 'minglu12minglu12minglu12minglu12',
        notifyUrl: "http://wq8.youqulexiang.com/payment/",
        mchId: "1447732502",
        pfx: fs.readFileSync(path.resolve(__dirname, '../../temp/apiclient_cert.p12'))
    }




    public wxOauth = new WechatOauth(this.wechat.appid, this.wechat.appsecret);
    public wxPay = new WechatPay({
        apiKey: this.wechat.apiKey,
        appid: this.wechat.appid,
        trade_type: 'APP',
        notify_url: this.wechat.notifyUrl,
        mch_id: this.wechat.mchId,
        pfx: this.wechat.pfx
    });
    public wxApi = new WechatApi(this.wechat.appid, this.wechat.appsecret);


}





Object.seal(exports.default)