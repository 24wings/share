"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config_1 = require("../config");
const fs = require("fs");
exports.uploader = {
    uploadBase64: async (req, res, next) => {
        let base64 = req.body.base64;
        let url = await uploadFile(base64, req.body.filename || 'test.png');
        res.json({ ok: true, data: config_1.CONFIG.IP + url });
    },
};
function uploadFile(file, filename) {
    return new Promise((resolve, reject) => {
        if (file.indexOf('base64,') != -1) {
            file = file.substring(file.indexOf('base64,') + 7);
        }
        let randomFilename = new Date().getTime() + filename;
        let distpath = path.resolve(__dirname, '../../public/upload/' + randomFilename);
        fs.writeFile(distpath, new Buffer(file, 'base64'), (err) => {
            err ? resolve(false) : resolve('/upload/' + randomFilename);
        });
    });
}
exports.uploadFile = uploadFile;
