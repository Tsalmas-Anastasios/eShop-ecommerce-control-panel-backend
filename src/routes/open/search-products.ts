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
    productsList, specificProductsList
} from '../../lib/products.service';







export class ProductsSearchOpenAPIRoutes {


    public routes(server: Application) {


        server.route('/api/open/:token/products/search')
            .get(openApiCheckerMiddlewareService.checkAuthToken, async (req: Request, res: Response) => {

                try {

                    const search_parameters: GraphQlSearchProductsParamsArgs = {
                        ...req.query,
                        connected_account_id: utils.findAccountIdDecodeTokenVerification(req.params.token),
                    };


                    let products_list: Product[];
                    if (req.session.user.using_bizyhive_cloud)
                        products_list = await specificProductsList.getProducts(search_parameters, req);


                    return res.status(200).send(products_list);

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });






        server.route('/api/open/products/search')
            .get(async (req: Request, res: Response) => {

                try {

                    const token_value = req.body?.token || req.headers['x-access-token'] || null;
                    if (token_value === null)
                        return res.status(401).send({
                            code: 401,
                            type: 'unauthorized',
                            message: 'Missing token key',
                        });




                    return res.redirect(
                        url.format({
                            pathname: `/api/open/${token_value}/products/search`,
                            query: req.query
                        })
                    );


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


