import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config, emailServer } from '../config';
import {
    ordersList, specificOrdersList, specificOrder, updateOrder, addNewOrder, checkOrder,
    shopData, orderTransactionsHistoryHandlerService
} from '../lib/orders.service';
import { orderProductsListEmailOrderSent } from '../lib/email-templates/services/order-sent.service';
import {
    OrderTypeSearch, SpecificListOrdersParams, NewUpdateOrder, OrderChangesAppliedMail,
    OrderConfirmationMailUsedData, OrderTransaction
} from '../models';

import { OrderChangesApplied } from '../lib/email-templates/mails/order-changes-applied';
import { OrderConfirmationMail } from '../lib/email-templates/mails/order-confirmation';
import { ProductStockAlertEmailTemplate } from '../lib/email-templates/mails/activate-account copy';

import { mailServer } from '../lib/connectors/mailServer';
import { shopDetailsRandomData, shopDetailsSocialLinks } from '../lib/shop-data-random.service';


export class OrdersRoutes {

    public routes(server: Application): void {


        // general lsit of orders
        server.route('/api/ecommerce/store/orders/orders')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let orders_list: OrderTypeSearch[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        orders_list = await ordersList.getOrders({ connected_account_id: account_id }, req);

                    return res.status(200).send(orders_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // specific orders list
        server.route('/api/ecommerce/store/orders/specific-orders')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: SpecificListOrdersParams = new SpecificListOrdersParams(req.query);

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let orders_list: OrderTypeSearch[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        orders_list = await specificOrdersList.getOrders(params, account_id, req);

                    return res.status(200).send(orders_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // specific order
        server.route('/api/ecommerce/store/orders/:order_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const order_id = req.params.order_id;

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let order: OrderTypeSearch;
                    if (req.session.user.using_bizyhive_cloud)
                        if (await checkOrder.orderExists(order_id, account_id))
                            order = await specificOrder.getOrder(order_id, account_id, req);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);

                    return res.status(200).send(order);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {
                // update the order here

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order: OrderTypeSearch = new OrderTypeSearch(req.body);

                    if (!order?.order_id || !order?.proof || !order?.email || !order?.first_name || !order?.last_name || !order?.address || !order?.postal_code
                        || !order?.city || !order?.country || !order?.phone || !order?.transfer_courier || !order?.payment_type || !order?.order_number
                        || !order?.invoice_data__invoice_number || !order?.order_products || utils.lodash.isEmpty(order.order_products))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_credentials_to_update_the_order',
                            message: 'Missing credentials and the order cannot be updated'
                        }, res);

                    for (let i = 0; i < order.order_products.length; i++)
                        if (!order.order_products[i]?.product_id || order.order_products[i].product_id === null
                            || !order.order_products[i]?.quantity || order.order_products[i].quantity === null
                            || !order.order_products[i]?.supplied_customer_price || order.order_products[i].supplied_customer_price === null
                            || !order.order_products[i]?.fees || order.order_products[i].fees === null
                            || !order.order_products[i]?.fee_percent || order.order_products[i].fee_percent === null)
                            return utils.errorHandlingReturn({
                                code: 401,
                                type: 'missing_order_products_info',
                                message: 'Missing products info and cannot be recognized',
                            }, res);




                    // update the order
                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        if (await checkOrder.orderExists(order.order_id, account_id))
                            await updateOrder.updateOrder(order, account_id);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                        let products_transactions = '';
                        for (const product of order.order_products)
                            if (product.status === 'new')
                                products_transactions += `
                                    INSERT INTO
                                        products_transactions
                                    SET
                                        product_id = ${product.product_id},
                                        connected_account_id = ${account_id},
                                        updated_by = ${user_id},
                                        quantity = ${product.quantity};
                                `;



                        const result = await mysql.query(products_transactions);


                        const email_object: OrderChangesAppliedMail = {
                            order_id: order.order_id,
                            connected_account: account_id,
                            shop_logo: await shopDetailsRandomData.getShopLogoUrl(account_id),
                            shop_url: await shopDetailsRandomData.getShopUrl(account_id),
                            first_name: order.first_name,
                            last_name: order.last_name,
                            order_number: order.order_number,
                            shop_name: await shopDetailsRandomData.getShopName(account_id),
                            shop_google_rate_url: await shopDetailsSocialLinks.getShopGoogleRateUrl(account_id),

                            billing__address: order?.invoice_data__address || order.address,
                            billing__city: order?.invoice_data__city || order.city,
                            billing__postal_code: order?.invoice_data__postal_code || order.postal_code,
                            billing__country: order?.invoice_data__country || order.country,
                            billing__phone_number: order?.invoice_data__phone || order.phone,
                            billing__first_name: order?.invoice_data__first_name || order.first_name,
                            billing__last_name: order?.invoice_data__last_name || order.last_name,
                            delivery__address: order.address,
                            delivery__city: order.city,
                            delivery__postal_code: order.postal_code,
                            delivery__country: order.country,
                            delivery__phone_number: order.phone,
                            delivery__first_name: order.first_name,
                            delivery__last_name: order.last_name,

                            products: await orderProductsListEmailOrderSent.createProductCards({ order_id: order.order_id, connected_account_id: account_id }, req),
                        };




                        // update transactions
                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order.order_id,
                            connected_account_id: order.connected_account_id,
                            updated_by: user_id,
                            whole_order_updated: true,
                        });



                        const emailId = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [order.email],
                            subject: `Order Details changed #${order.order_number} - Bizyhive`,
                            html: new OrderChangesApplied(email_object).html,
                        });

                    }



                    return res.status(200).send({ code: 200, type: 'order_updated', message: 'Your order has been successfully updated!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // add new order
        server.route('/api/ecommerce/store/orders/ord/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {


                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const data: NewUpdateOrder = new NewUpdateOrder(req.body);

                    if (!data?.proof || !data?.email || !data?.first_name || !data?.last_name || !data?.address || !data?.postal_code || !data?.city
                        || !data?.country || !data?.phone || !data?.transfer_courier || !data?.payment_type || !data?.clear_value
                        || !data?.fees || !data?.fee_percent || !data?.order_total || !data?.order_products)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_credentials_to_add_the_order',
                            message: 'Missing credentials and the order cannot be added'
                        }, res);

                    for (let i = 0; i < data.order_products.length; i++)
                        if (!data.order_products[i]?.product_id || data.order_products[i].product_id === null
                            || !data.order_products[i]?.quantity || data.order_products[i].quantity === null
                            || !data.order_products[i]?.supplied_customer_price || data.order_products[i].supplied_customer_price === null
                            || !data.order_products[i]?.fees || data.order_products[i].fees === null
                            || !data.order_products[i]?.fee_percent || data.order_products[i].fee_percent === null)
                            return utils.errorHandlingReturn({
                                code: 401,
                                type: 'missing_order_products_info',
                                message: 'Missing products info and cannot be recognized',
                            }, res);




                    // add the order
                    let new_order_identifiers: any = null;
                    if (req.session.user.using_bizyhive_cloud) {

                        const returned_results = await addNewOrder.addOrder(data, account_id);

                        new_order_identifiers = returned_results.identifiers;



                        let products_transactions = '';
                        for (const product of data.order_products)
                            products_transactions += `
                                INSERT INTO
                                    products_transactions
                                SET
                                    product_id = ${product.product_id},
                                    connected_account_id = ${account_id},
                                    updated_by = ${user_id},
                                    quantity = ${product.quantity};
                            `;


                        const result = await mysql.query(products_transactions);




                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: new_order_identifiers.order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            order_created_at: new Date(),
                        });



                        const email_data: OrderConfirmationMailUsedData = {
                            shop_logo: await shopDetailsRandomData.getShopLogoUrl(account_id),
                            shop_url: await shopDetailsRandomData.getShopUrl(account_id),
                            first_name: data.first_name,
                            last_name: data.last_name,
                            order_number: new_order_identifiers.order_number,
                            shop_name: await shopDetailsRandomData.getShopName(account_id),
                            shop_google_rate_url: await shopDetailsSocialLinks.getShopGoogleRateUrl(account_id),
                        };

                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [data.email],
                            subject: `Order confirmed #${new_order_identifiers.order_number} - Bizyhive`,
                            html: new OrderConfirmationMail(email_data).html,
                        });



                        if (returned_results?.stock_alert_products?.length >= 0) {

                            const tmp_result = await mysql.query(`
                                SELECT
                                    contact_email
                                WHERE
                                    connected_account_id = :connected_account_id;
                            `, { connected_account_id: account_id });

                            const contact_email = tmp_result.rows[0].contact_email.toString();



                            const stock_alert_email_id = await mailServer.send_mail({
                                from_name: emailServer.orders_email.defaults.name,
                                from_email: emailServer.orders_email.defaults.email,
                                from_psswd: emailServer.orders_email.auth.password,
                                to: [contact_email],
                                subject: 'Products stock need attention!',
                                html: new ProductStockAlertEmailTemplate(returned_results.stock_alert_products).html,
                            });

                        }

                    }



                    return res.status(200).send({ code: 200, type: 'order_saved', message: 'Your order has been successfully saved!', order_identifiers: new_order_identifiers });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });







        // order notes add / update (all in one route)
        server.route('/api/ecommerce/store/orders/:order_id/notes')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const order_id = req.params.order_id;
                    const notes = req.body.notes;
                    if (req.session.user.using_bizyhive_cloud) {
                        if (!await checkOrder.orderExists(order_id, account_id))
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: 'The order you are looking for, doesn\'t exist' }, res);


                        const result = await mysql.query(`
                            UPDATE
                                orders
                            SET
                                notes = :notes
                            WHERE
                                order_id = :order_id AND
                                connected_account_id = :connected_account_id
                        `, {
                            notes: notes,
                            order_id: order_id,
                            connected_account_id: account_id,
                        });

                    }



                    return res.status(200).send({ code: 200, type: 'notes_updated', message: 'Notes updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // change seen status for an order
        server.route('/api/ecommerce/store/orders/:order_id/order-seen')
            .put(utils.checkAuth, async (req: Request, res: Response) => {


                const params: {
                    order_id: string;
                    user_id: string;
                    connected_account_id: string;
                } = {
                    order_id: req.params.order_id.toString(),
                    user_id: req.session.user.user_id,
                    connected_account_id: utils.findAccountIDFromSessionObject(req)
                };



                let viewed = false;
                try {

                    const viewed_result = await mysql.query(`SELECT order_seen FROM orders WHERE order_id = :order_id AND connected_account_id = :connected_account_id`, params);
                    if (viewed_result.rows[0].order_seen)
                        viewed = true;

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }




                if (!viewed)
                    try {


                        Promise.resolve([

                            await mysql.query(`
                                UPDATE
                                    orders
                                SET
                                    order_seen = 1
                                WHERE
                                    order_id = :order_id AND
                                    connected_account_id = :connected_account_id;
                            `, params),



                            // set transactions
                            await mysql.query(`
                                INSERT INTO
                                    orders_transactions
                                SET
                                    order_seen = 1,
                                    order_id = :order_id,
                                    connected_account_id = :connected_account_id,
                                    updated_by = :user_id
                            `, params),

                        ]);


                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }


                return res.status(200).send({
                    code: 200,
                    type: 'order_seen'
                });


            });


    }

}

