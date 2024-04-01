import { Application, Request, Response, request } from 'express';
const url = require('url');
import {
    Product, GraphQlSearchProductsParamsArgs
} from '../../models';
import { utils } from '../../lib/utils.service';
import { openApiCheckerMiddlewareService } from '../../lib/open-api-middleware.service';
import { config, emailServer } from '../../config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    productsList
} from '../../lib/products.service';






export class ProductItemOpenAPIRoutes {


    public routes(server: Application) {


        server.route('/api/open/:token/products/:product_id')
            .get(openApiCheckerMiddlewareService.checkAuthToken, async (req: Request, res: Response) => {

                try {

                    const search_parameters: GraphQlSearchProductsParamsArgs = {
                        product_id: req.params.product_id,
                        connected_account_id: utils.findAccountIdDecodeTokenVerification(req.params.token),
                    };


                    let product: Product;
                    if (req.session.user.using_bizyhive_cloud)
                        product = await productsList.getProduct(
                            search_parameters.product_id,
                            search_parameters.connected_account_id,
                            req
                        );


                    return res.status(200).send(product);

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });





        server.route('/api/open/products/:product_id')
            .get((req: Request, res: Response) => {

                try {

                    const token_value = req.body?.token || req.headers['x-access-token'] || null;
                    if (token_value === null)
                        return res.status(401).send({
                            code: 401,
                            type: 'unauthorized',
                            message: 'Missing token key',
                        });


                    if (!req.params?.product_id)
                        return res.status(400).send({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing data (product ID from link params)',
                        });


                    const product_id = req.params.product_id;
                    return res.redirect(`/api/open/${token_value}/products/${product_id}`);

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });


    }


}
