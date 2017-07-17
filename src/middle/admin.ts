import express = require('express');
var adminRouter = express.Router();


adminRouter.get('/', function (req, res, next) {
    res.json({ ok: true });
});

export { adminRouter };


