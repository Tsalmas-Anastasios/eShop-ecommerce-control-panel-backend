import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { ProductTransaction } from '../models';

import { productsTransactionsGetListService } from '../lib/product-transactions.service';



export class ProductTransactionsRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/:product/product-transactions')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        product_id: string;
                        page: number;
                        connected_account_id: string;
                    } = {
                        product_id: req.params.product.toString(),
                        page: req?.query?.page ? Number(req.query.page) : 1,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };



                    const product_transactions = await productsTransactionsGetListService.getList(params, req);



                    return res.status(200).send(product_transactions);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
