import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { PromiseProductsModeling, ProductSearchParams } from '../models';

import { productsListFromSearchService } from '../lib/product-search.service';





export class ProductSearchRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/search/global-search')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const search_parameters: ProductSearchParams = new ProductSearchParams({
                        product_code: req?.query?.product_code?.toString() || null,
                        headline: req?.query?.headline?.toString() || null,
                        product_brand: req?.query?.product_brand?.toString() || null,
                        product_model: req?.query?.product_model?.toString() || null,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        page: Number(req?.query?.page) || null,
                        limit: Number(req?.query?.limit) || null,
                    });



                    let products_list: PromiseProductsModeling[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        products_list = await productsListFromSearchService.searchProductsList(search_parameters, req);



                    return res.status(200).send(products_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
