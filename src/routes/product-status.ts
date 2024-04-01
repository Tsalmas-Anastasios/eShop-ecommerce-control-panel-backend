import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import { Product, GraphQlSearchProductsParamsArgsSpecificList, GraphQlSearchProductsParamsArgsSpecificProduct } from '../models';

import {
    productsList, specificProductsList, addNewProduct, checkProductService, updateProductDataService
} from '../lib/products.service';
import { updateProductStatusService, archiveProductService } from '../lib/product-status.service';
import { update } from 'lodash';
import { mysql } from '../lib/connectors/mysql';




export class ProductStatusRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/:product_id/:status')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    const identifiers = {
                        product_id: req.params.product_id,
                        status: req.params.status,
                        account_id: account_id,
                    };


                    if (req.session.user.using_bizyhive_cloud) {

                        // check if product exists
                        if (!await checkProductService.productExists({ product_id: identifiers.product_id, connected_account_id: identifiers.account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product not found for this account' }, res);

                        if (identifiers.status !== 'in_stock' && identifiers.status !== 'available_1_to_3_days' && identifiers.status !== 'available_1_to_10_days'
                            && identifiers.status !== 'available_1_to_30_days' && identifiers.status !== 'with_order' && identifiers.status !== 'unavailable'
                            && identifiers.status !== 'temporary_unavailable' && identifiers.status !== 'out_of_stock' && identifiers.status !== 'ended' && identifiers.status !== 'closed')
                            return utils.errorHandlingReturn({ code: 400, type: 'wrong_status_value', message: 'Wrong status value for this product' }, res);


                        const result = await mysql.query(`SELECT current_status FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id`, { product_id: identifiers.product_id, connected_account_id: identifiers.account_id });
                        const current_status = result.rows[0].current_status.toString();


                        // update status
                        await updateProductStatusService.updateProductStatus({ product_id: identifiers.product_id, connected_account_id: identifiers.account_id }, identifiers.status);
                        // update history
                        const version_id = await updateProductStatusService.getVersionId({ product_id: identifiers.product_id, connected_account_id: identifiers.account_id });
                        await updateProductStatusService.updateStatusOnHistory({ version_id: version_id, product_id: identifiers.product_id, connected_account_id: identifiers.account_id }, identifiers.status);

                        await updateProductDataService.createProductTransactions({
                            product_id: identifiers.product_id,
                            connected_account_id: identifiers.account_id,
                            updated_by: user_id,
                            status_changed: true,
                            status_before: current_status,
                            status_after: identifiers.status
                        });

                    }



                    return res.status(200).send({ code: 200, type: 'status_updated', message: 'Status updated successfully', current_status: identifiers.status });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/ecommerce/store/products/:product_id/archived')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {


                    const product_id = req.params.product_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);


                    if (req.session.user.using_bizyhive_cloud) {

                        // check if product exists
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product not found for this account' }, res);



                        const result = await mysql.query(`SELECT current_status FROM products WHERE product_id = :product_id AND connected_account_id = ;connected_account_id`, { product_id: product_id, connected_account_id: account_id });
                        const current_status = result.rows[0].toString();


                        // archive product
                        const new_version_id = await archiveProductService.archiveProduct({ product_id: product_id, connected_account_id: account_id });

                        await updateProductDataService.insertUpdateToHistory({ product_id: product_id, connected_account_id: account_id, version_id: new_version_id }, true);


                        await updateProductDataService.createProductTransactions({
                            product_id: product_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_changed: true,
                            status_before: current_status,
                            status_after: 'archived'
                        });

                    }



                    return res.status(200).send({ code: 200, type: 'product_archived', message: 'Product archived-deleted' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
