import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { specificProductsList } from '../lib/products.service';
import { Product } from '../models';





export class ProductInventoryProductsRoutes {


    public routes(server: Application) {



        server.route('/api/products/inventories/get-products')
            .get(utils.checkAuth, async (req: Request, res: Response) => {


                const graphql_params: {
                    connected_account_id: string;
                    current_status: string;
                    page: number;
                } = {
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    current_status: 'stock',
                    page: 1,
                };


                try {


                    let products_list: Product[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        while (true) {

                            // offset --> 100
                            const tmp_products_list: Product[] = await specificProductsList.getProducts(graphql_params, req);

                            products_list = [...products_list, ...tmp_products_list];

                            if (tmp_products_list.length % 100 !== 0)
                                break;


                            graphql_params.page++;

                        }




                    return res.status(200).send(products_list);


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



    }


}
