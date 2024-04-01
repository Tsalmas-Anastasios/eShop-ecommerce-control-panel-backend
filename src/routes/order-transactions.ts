import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { OrderTransaction } from '../models';
import { orderTransactionsGetListService } from '../lib/order-transactions.service';




export class OrderTransactionsRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/orders/:order_id/order-transactions')
            .get(async (req: Request, res: Response) => {

                try {

                    const params: {
                        order_id: string;
                        page: number;
                        connected_account_id: string;
                    } = {
                        order_id: req.params.order_id.toString(),
                        page: req?.query?.page ? Number(req.query.page) : 1,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const order_transactions = await orderTransactionsGetListService.getList(params, req);


                    return res.status(200).send(order_transactions);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
