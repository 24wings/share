import { Core } from '../lib';
@Core.Route.Controller({
    service: 'share-server',
    viewPath: 'share-server'
})
export default class ShareAdminRoute extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'banner-list': return this.bannerList;//分页
            case 'add-banner': return this.addBanner;
            case 'banner':
                switch (method) {
                    case 'get': return this.bannerDetail;
                    case 'put': return this.bannerUpdate;
                }
            case 'toggle-banner-active':
                return this.toggleBannerActive;

            default: return this.index;
        }
    }
    async toggleBannerActive() {
        let banner = await this.db.bannerModel.findById(this.req.query._id).exec();
        let update = banner.update({ active: !banner.active }).exec();
        this.res.json({
            ok: true,
            data: update
        })
    }
    async bannerDetail() {
        let { _id } = this.req.query;
        let banner = await this.db.bannerModel.findById(_id).populate('task').exec();
        this.res.json({ ok: true, data: banner });
    }

    async bannerUpdate() {
        let { _id } = this.req.query;
        let { sort, bannerImg } = this.req.body;
        let newBanner = await this.db.bannerModel.findByIdAndUpdate(_id, { sort, bannerImg }).exec();
        this.res.json({ ok: true, data: newBanner });

    }

    before() {
        this.next();
    }
    after() {

    }
    async addBanner() {
        let { taskId } = this.req.query;

        let newBanner = await new this.db.bannerModel({ task: taskId }).save();
        this.res.json({ ok: true, data: newBanner });

    }

    async bannerList() {
        let banners = await this.db.bannerModel.find().populate('task').exec();
        this.res.json({ ok: true, data: { banners, count: banners.length } });
    }


    index() {

    }


}