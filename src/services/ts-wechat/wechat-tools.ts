import md5 = require('md5');
import xml2js = require('xml2js');
export default new class {
    urls = {
        transfers: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers'
    }
    parseXml(xml: string) {
        let parser = new xml2js.Parser();
        return parser.parseString(xml);
    }
    bulildXml(obj: Object) {


        let builder = new xml2js.Builder()
        return builder.buildObject(obj)

        /*
              let xml = ``
        for (let key in obj) {
            xml += `<${key}>${obj[key]}</${key}>
            `;
        }
        xml = `<xml>
            ${xml}
            </xml>
            `;
        return xml;*/
    }
    buildSignStr(obj: Object) {
        var str = '';
        for (let key in obj) {
            str += `&${key}=${obj[key]}`;
        }
        str = str.startsWith(`&`) ? str.substring(1) : str;
        return str;
    }
    createQueryString(options: Object) {
        return Object.getOwnPropertyNames(options)
            .filter(key => options[key] !== undefined && options[key] !== '' && ['pfx', 'apiKey', 'sign', 'key'].indexOf(key) < 0)
            .sort().map(key => key + '=' + options[key])
            .join('&');
    }

    sign(options: Object, key: string) {
        let queryStr = this.createQueryString(options) + `&key=` + key;
        return md5(queryStr).toUpperCase();
    }
    getRadomStr(length = 32) {
        length = length || 24;
        if (length > 32) length = 32;

        return (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, length);
    }

}