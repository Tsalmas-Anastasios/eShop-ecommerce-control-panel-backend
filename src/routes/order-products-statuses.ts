import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { updateProduct } from '../lib/order-products-statuses.service';
import { checkOrder } from '../lib/orders.service';
import { checkProducts } from '../lib/order-products.service';


export class OrderProductsStatusRoutes {

    public routes(server: Application): void {



        // archive a product
        server.route('/api/ecommerce/store/orders/:order_id/products/:product_id/archive')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: any = {
                        order_id: req.params.order_id,
                        product_id: req.params.product_id,
                    };



                    // update product status
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    if (req.session.user.using_bizyhive_cloud)
                        if (await checkOrder.orderExists(params.order_id, account_id) && await checkProducts.productExistsOnOrder(params, account_id))
                            await updateProduct.archiveProduct(params, account_id);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                    return res.status(200).send({
                        code: 200,
                        type: 'product_status_changed',
                        message: 'Product status changed successfully'
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // activate a product
        server.route('/api/ecommerce/store/orders/:order_id/products/:product_id/active')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: any = {
                        order_id: req.params.order_id,
                        product_id: req.params.product_id,
                    };



                    // update product status
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    if (req.session.user.using_bizyhive_cloud)
                        if (await checkOrder.orderExists(params.order_id, account_id) && await checkProducts.productExistsOnOrder(params, account_id))
                            updateProduct.activateProduct(params, account_id);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                    return res.status(200).send({
                        code: 200,
                        type: 'product_status_changed',
                        message: 'Product status changed successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }

}

