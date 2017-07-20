import { Route, RequestHandler, Request, Response } from '../route';


export class ShareAdminRoute extends Route.BaseRoute implements Route.IRoute {
    // do 的常见几种操作
    LIST='list';
    VIEWDIR='share-admin';
    doAction(action: string, method: string,next:RequestHandler) {
        switch (action){
            case  'task-list':
            return this.taskList;
            
            case 'task-detail':
            return this.taskDetail;
            case 'task-delete':
            return this.taskDelete;
            case 'taskTag-list':
            return this.taskTagList;
            case 'taskTag-detail':
            return this.taskTagDetail;
            case 'taskTag-new':
            return this.GET==method?this.taskTagNewPage:this.taskTagNewPageDo;
            case 'order-list':
            return this.orderList;
            
            default:
            return this.index;
        }
        
        
    }

    index(req: Request, res: Response) {
        res.render(`${this.VIEWDIR}/index`);
    }
    async taskDelete(req:Request,res:Response){
        var _id = req.query._id;
       let action = await this.service.db.taskModel.findByIdAndRemove(_id).exec();
       res.redirect(`/${this.VIEWDIR}/task-list`);
    }
   async  taskList(req:Request,res:Response){
        var tasks = await this.service.db.taskModel.find().populate('publisher  taskTag').exec();
        res.render(`${this.VIEWDIR}/task-list`,{tasks});
    }
    orderList(req:Request,res:Response){
            res.render(`${this.VIEWDIR}/order-list`);
    }

   async  taskDetail(req:Request,res:Response){
        var task  = await this.service.db.taskModel.findById(req.query._id).populate('publisher taskTag').exec()
        res.render(`${this.VIEWDIR}/task-detail`,{task});
    }
    async taskTagList(req:Request,res:Response){
        var taskTags = await this.service.db.taskTagModel.find().exec();
        res.render(`${this.VIEWDIR}/taskTag-list`,{taskTags})
    }
    async taskTagDetail(req:Request,res:Response){
       var taskTag = await  this.service.db.taskTagModel.findById(req.query._id).exec();
       res.render(`${this.VIEWDIR}/taskTag-detail`,{taskTag});
    }
    async taskTagNewPage(req:Request,res:Response){
        res.render(`${this.VIEWDIR}/taskTag-new`)
    }
    async taskTagNewPageDo(req:Request,res:Response){
    let {name} = req.body;
      let newTaskTag =  await   new this.service.db.taskTagModel({name}).save();
      res.redirect('/share-admin/taskTag-list');
    }
}
