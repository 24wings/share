import { db } from '../models';
export ={
    /**
     * 返还佣金
     * money 任务的奖金
     */
    returnMoney: async (orders: { task: string, userId: string, money: number }[]) => {
        for (var order of orders) {
            await db.userModel.findById(order.userId).update({ $inc: { todayMoney: order.money, totalMoney: order.money, historyMoney: order.money } }).exec();
            await new db.taskOrder({ task: order.task, money: order.money, toPeople: order.userId }).save();
        }
    }
}