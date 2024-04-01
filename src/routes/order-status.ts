import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { updateOrder, getOrderStatusService } from '../lib/order-status.service';
import { checkOrder, orderTransactionsHistoryHandlerService } from '../lib/orders.service';

import {
    OrderConfirmationMailUsedData, OrderSentMailData, OrderSentStandardMailData, OrderCancelledMailData,
    OrderTransaction
} from '../models';
import { orderRandomData } from '../lib/order-random-data.service';
import { mailServer } from '../lib/connectors/mailServer';

import { OrderConfirmationMail } from '../lib/email-templates/mails/order-confirmation';
import { OrderSentMail } from '../lib/email-templates/mails/order-sent';
import { OrderCompletedMail } from '../lib/email-templates/mails/order-completed';
import { orderProductsListEmailOrderSent } from '../lib/email-templates/services/order-sent.service';
import { OrderCancelledMail } from '../lib/email-templates/mails/order-cancelled';

import { orderSentDataForEmail } from '../lib/order-details-data-for-email.service';



export class OrderStatusRoutes {

    public routes(server: Application): void {


        // update order to status 'confirmed'
        server.route('/api/ecommerce/store/orders/:order_id/confirmed')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order_id = req.params.order_id;

                    // update the order
                    let sent_date: Date;
                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        const current_status = await getOrderStatusService.getStatus(order_id, account_id);



                        if (await checkOrder.orderExists(order_id, account_id))
                            sent_date = await updateOrder.updateOrder(order_id, account_id, 'confirmed');
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                        // history of transactions
                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_updated: true,
                            status_before: current_status,
                            status_after: 'confirmed',
                        });


                        // send email
                        const email_data: OrderConfirmationMailUsedData = await orderRandomData.orderConfirmMailData({ order_id: order_id, connected_account_id: account_id }, req);
                        const email_to = await orderRandomData.getOrderEmail({ order_id: order_id, connected_account_id: account_id });
                        const order_number = await orderRandomData.getOrderNumber({ order_id: order_id, connected_account_id: account_id });
                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [email_to],
                            subject: `Order confirmed #${order_number} - Bizyhive`,
                            html: new OrderConfirmationMail(email_data).html,
                        });
                    }




                    return res.status(200).send({
                        code: 200,
                        type: 'order_updated_to_confirmed',
                        message: 'Order has been successfully updated with status \'confirmed\'',
                        updated_datetime: sent_date,
                        current_status: 'confirmed',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        // update order to status 'sent'
        server.route('/api/ecommerce/store/orders/:order_id/sent')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order_id = req.params.order_id;

                    // update the order
                    let sent_date: Date;
                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        const current_status = await getOrderStatusService.getStatus(order_id, account_id);


                        if (await checkOrder.orderExists(order_id, account_id))
                            sent_date = await updateOrder.updateOrder(order_id, account_id, 'sent');
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);




                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_updated: true,
                            status_before: current_status,
                            status_after: 'sent',
                        });



                        // take data for email
                        const temp_data: OrderConfirmationMailUsedData = await orderRandomData.orderConfirmMailData({ order_id: order_id, connected_account_id: account_id }, req);
                        const address_details: OrderSentStandardMailData = await orderSentDataForEmail.getInvoiceAndAddressDetails({ order_id: order_id, connected_account_id: account_id }, req);
                        const email_data: OrderSentMailData = {
                            order_id: order_id,
                            connected_account: account_id,
                            shop_logo: temp_data.shop_logo,
                            shop_url: temp_data.shop_url,
                            first_name: temp_data.first_name,
                            last_name: temp_data.last_name,
                            order_number: temp_data.order_number,
                            shop_name: temp_data.shop_name,
                            shop_google_rate_url: temp_data.shop_google_rate_url,
                            address: address_details.address,
                            postal_code: address_details.postal_code,
                            city: address_details.city,
                            country: address_details.country,
                            phone: address_details.phone,
                            invoice_data__first_name: address_details.invoice_data__first_name !== null ? address_details.invoice_data__first_name : temp_data.last_name,
                            invoice_data__last_name: address_details.invoice_data__last_name !== null ? address_details.invoice_data__last_name : temp_data.first_name,
                            invoice_data__address: address_details.invoice_data__address !== null ? address_details.invoice_data__address : address_details.address,
                            invoice_data__postal_code: address_details.invoice_data__postal_code !== null ? address_details.invoice_data__postal_code : address_details.postal_code,
                            invoice_data__city: address_details.invoice_data__city !== null ? address_details.invoice_data__city : address_details.city,
                            invoice_data__country: address_details.invoice_data__country !== null ? address_details.invoice_data__country : address_details.country,
                            invoice_data__phone: address_details.invoice_data__phone !== null ? address_details.invoice_data__phone : address_details.phone,
                            tracking_number: address_details.tracking_number,
                            tracking_url: address_details.tracking_url,
                            products: await orderProductsListEmailOrderSent.createProductCards({ order_id: order_id, connected_account_id: account_id }, req),
                        };
                        const email_to = await orderRandomData.getOrderEmail({ order_id: order_id, connected_account_id: account_id });
                        const order_number = await orderRandomData.getOrderNumber({ order_id: order_id, connected_account_id: account_id });

                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [email_to],
                            subject: `Order sent #${order_number} - Bizyhive`,
                            html: new OrderSentMail(email_data).html,
                        });

                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'order_updated_to_sent',
                        message: 'Order has been successfully updated with status \'sent\'',
                        updated_datetime: sent_date,
                        current_status: 'sent',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        // update order to status 'completed'
        server.route('/api/ecommerce/store/orders/:order_id/completed')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order_id = req.params.order_id;

                    // update the order
                    let completed_date: Date;
                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        const current_status = await getOrderStatusService.getStatus(order_id, account_id);


                        if (await checkOrder.orderExists(order_id, account_id))
                            completed_date = await updateOrder.updateOrder(order_id, account_id, 'completed');
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_updated: true,
                            status_before: current_status,
                            status_after: 'completed',
                        });


                        const email_data: OrderConfirmationMailUsedData = await orderRandomData.orderConfirmMailData({ order_id: order_id, connected_account_id: account_id }, req);
                        const email_to = await orderRandomData.getOrderEmail({ order_id: order_id, connected_account_id: account_id });
                        const order_number = await orderRandomData.getOrderNumber({ order_id: order_id, connected_account_id: account_id });
                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [email_to],
                            subject: `✅ Order completed #${order_number} - Bizyhive`,
                            html: new OrderCompletedMail(email_data).html,
                        });
                    }




                    return res.status(200).send({
                        code: 200,
                        type: 'order_updated_to_completed',
                        message: 'Order has been successfully updated with status \'completed\'',
                        updated_datetime: completed_date,
                        current_status: 'completed',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // update order to status 'archived'
        server.route('/api/ecommerce/store/orders/:order_id/archived')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order_id = req.params.order_id;

                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        const current_status = await getOrderStatusService.getStatus(order_id, account_id);

                        if (await checkOrder.orderExists(order_id, account_id))
                            await updateOrder.archiveOrder(order_id, account_id);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_updated: true,
                            status_before: current_status,
                            status_after: 'archived',
                        });



                        // send email here
                        const email_data: OrderCancelledMailData = await orderRandomData.orderConfirmMailData({ order_id: order_id, connected_account_id: account_id }, req);
                        email_data.date_time = Date();
                        const email_to = await orderRandomData.getOrderEmail({ order_id: order_id, connected_account_id: account_id });
                        const order_number = await orderRandomData.getOrderNumber({ order_id: order_id, connected_account_id: account_id });
                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [email_to],
                            subject: `😞 Order closed #${order_number} - Bizyhive`,
                            html: new OrderCancelledMail(email_data).html,
                        });
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'order_canceled',
                        message: 'Order canceled successfully. This action cannot been undo',
                        updated_datetime: new Date(),
                        current_status: 'archived',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // return an order
        server.route('/api/ecommerce/store/orders/:order_id/returned')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const order_id = req.params.order_id;

                    if (req.session.user.using_bizyhive_cloud) {
                        const account_id = utils.findAccountIDFromSessionObject(req);

                        const current_status = await getOrderStatusService.getStatus(order_id, account_id);

                        if (await checkOrder.orderExists(order_id, account_id))
                            await updateOrder.returnOrder(order_id, account_id);
                        else
                            return utils.errorHandlingReturn({ code: 404, type: 'order_not_found', message: `Order doesn't found for this account` }, res);



                        await orderTransactionsHistoryHandlerService.addTransaction({
                            order_id: order_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            status_updated: true,
                            status_before: current_status,
                            status_after: 'returned',
                        });



                        // send email here
                        const email_data: OrderCancelledMailData = await orderRandomData.orderConfirmMailData({ order_id: order_id, connected_account_id: account_id }, req);
                        email_data.date_time = Date();
                        const email_to = await orderRandomData.getOrderEmail({ order_id: order_id, connected_account_id: account_id });
                        const order_number = await orderRandomData.getOrderNumber({ order_id: order_id, connected_account_id: account_id });
                        const email_id = await mailServer.send_mail({
                            from_name: emailServer.orders_email.defaults.name,
                            from_email: emailServer.orders_email.defaults.email,
                            from_psswd: emailServer.orders_email.auth.password,
                            to: [email_to],
                            subject: `😞 Order closed #${order_number} - Bizyhive`,
                            html: new OrderCancelledMail(email_data).html,
                        });
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'order_returned',
                        message: 'Order returned successfully. This action cannot been undo',
                        updated_datetime: new Date(),
                        current_status: 'returned',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }

}
