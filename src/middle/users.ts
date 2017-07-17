var express = require('express');
import { CONFIG } from '../config';
import { db } from '../models';
var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
  res.json({ ok: true });
});
userRouter.get('/detail', async (req, res, next) => {
  let user = await db.userModel.findOne({ openid: req.query.openid }).exec();
  if (user) {
    res.json({ ok: true, data: user });
  } else {
    res.json({ ok: false, data: '该用户不存在' });
  }
});
userRouter.get('/task', async (req, res, next) => {
  let { page, taskTag } = req.query;
  let tasks = [];
  if (taskTag) {
    tasks = await db.taskModel.find({ taskTag }).skip(10 * page).limit(10).exec();
  }
  //返回推荐的,后面改接口
  else {
    tasks = await db.taskModel.find().skip(10 * page).limit(10).exec();
  }
  res.json({
    ok: true,
    data: tasks
  });

})
  .post('/postTask', async (req, res, next) => {
    let openid = req.query.openid;
    let user = await db.userModel.findOne({ openid }).exec();
    req.body.publisher = user._id;
    if (user) {
      let newTask = await new db.taskModel(req.body).save();
      res.json({
        ok: true,
        data: newTask
      });

    } else {
      res.json({
        ok: false,
        data: '错误'
      })
    }



  })

export { userRouter };
