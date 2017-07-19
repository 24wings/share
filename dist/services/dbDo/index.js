"use strict";
const models_1 = require("../models");
module.exports = {
    /**
     * 返还佣金
     * money 任务的奖金
     */
    returnMoney: async (orders) => {
        for (var order of orders) {
            await models_1.db.userModel.findById(order.userId).update({ $inc: { todayMoney: order.money, totalMoney: order.money, historyMoney: order.money } }).exec();
            await new models_1.db.taskOrder({ task: order.task, money: order.money, toPeople: order.userId }).save();
        }
    }
};
