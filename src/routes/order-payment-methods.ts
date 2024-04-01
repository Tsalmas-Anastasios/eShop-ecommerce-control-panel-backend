import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import { orderPaymentMethodsListService } from '../lib/order-payment-methods.service';




export class OrderPaymentMethodsRoutes {


    public routes(server: Application) {


        server.route('/api/payments/methods/list/active')
            .get(async (req: Request, res: Response) => {

                try {

                    const payment_methods = await orderPaymentMethodsListService.getList({ active: 1, archived: 0 }, req);

                    return res.status(200).send(payment_methods);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


        server.route('/api/payments/methods/:payment_id')
            .get(async (req: Request, res: Response) => {

                try {

                    const payment_id = req.params.payment_id as string;
                    const payment_method_details = await orderPaymentMethodsListService.getSpecificItem({ rec_id: payment_id }, req);


                    return res.status(200).send(payment_method_details);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
