import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import { orderProductsList, checkProducts } from '../lib/order-products.service';
import { checkOrder } from '../lib/orders.service';

import { OrderProducts } from '../models';


export class OrderProductsRoutes {

    public routes(server: Application): void {


        // order products general list
        server.route('/api/ecommerce/store/orders/:order_id/products')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const order_id: string = req.params.order_id;

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    let product_list: OrderProducts;
                    if (req.session.user.using_bizyhive_cloud)
                        if (await checkOrder.orderExists(order_id, account_id))
                            product_list = await orderProductsList.getProducts({ order_id: order_id, account_id: account_id }, req);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);


                    // return products list
                    return res.status(200).send({ product_list });
                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // specific order
        server.route('/api/ecommerce/store/orders/:order_id/products/:product_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: any = {
                        order_id: req.params.order_id,
                        product_id: req.params.product_id,
                    };


                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let product_list: OrderProducts;
                    if (req.session.user.using_bizyhive_cloud)
                        if (await checkOrder.orderExists(params.order_id, account_id) && await checkProducts.productExistsOnOrder({ order_id: params.order_id, product_id: params.product_id }, account_id))
                            product_list = await orderProductsList.getProducts({ order_id: params.order_id, account_id: account_id }, req);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);


                    // return the product details for the order
                    return res.status(200).send(product_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
