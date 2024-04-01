import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { mysql } from '../lib/connectors/mysql';

import { Product, GraphQlSearchProductsParamsArgsSpecificList, GraphQlSearchProductsParamsArgsSpecificProduct } from '../models';
import { checkProductService } from '../lib/products.service';




export class SharedProductsRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/:product/share-product')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        product_id: string;
                        connected_account_id: string;
                        user_id: string;
                    } = {
                        product_id: req.params.product.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        user_id: req.session.user.user_id.toString()
                    };



                    if (req.session.user.using_bizyhive_cloud) {

                        // check if the product exist
                        if (!await checkProductService.productExists({ product_id: params.product_id, connected_account_id: params.connected_account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        const result = await mysql.query(`
                            UPDATE
                                products
                            SET
                                product_shared = 1
                            WHERE
                                product_id = :product_id AND
                                connected_account_id = :connected_account_id;
                        `, params);

                    }



                    return res.status(200).send({ code: 200, type: 'product_shared', message: 'Product shared successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/ecommerce/store/products/:product/non-share-product')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        product_id: string;
                        connected_account_id: string;
                        user_id: string;
                    } = {
                        product_id: req.params.product.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        user_id: req.session.user.user_id.toString()
                    };



                    if (req.session.user.using_bizyhive_cloud) {

                        // check if the product exist
                        if (!await checkProductService.productExists({ product_id: params.product_id, connected_account_id: params.connected_account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        const result = await mysql.query(`
                            UPDATE
                                products
                            SET
                                product_shared = 0
                            WHERE
                                product_id = :product_id AND
                                connected_account_id = :connected_account_id;
                        `, params);

                    }



                    return res.status(200).send({ code: 200, type: 'product_shared', message: 'Product shared successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
