import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import {
    OrderSearchParams, PromiseOrdersModeling
} from '../models';

import { ordersListFromSearchService } from '../lib/orders-search.service';






export class OrdersSearchRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/orders/search/global-search')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const search_parameters: OrderSearchParams = new OrderSearchParams({
                        order_id: req.query?.order_id?.toString() || null,
                        order_number: req.query?.order_number?.toString() || null,
                        first_name: req.query?.first_name?.toString() || null,
                        last_name: req.query?.last_name?.toString() || null,
                        phone: req.query?.phone?.toString() || null,
                        email: req.query?.email?.toString() || null,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        page: Number(req.query?.page) || null,
                        limit: Number(req.query?.limit) || null,
                    });

                    let orders_list: PromiseOrdersModeling[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        orders_list = await ordersListFromSearchService.searchOrdersList(search_parameters, req);


                    return res.status(200).send(orders_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message, errors: error?.errors || null }, res);
                }

            });


    }


}

