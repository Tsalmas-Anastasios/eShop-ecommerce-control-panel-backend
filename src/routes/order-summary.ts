import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { OrderSummaryData, OrderSummaryDataAllTypes } from '../models';
import { getOrderSummaryData } from '../lib/order-summary.service';





export class OrderSummaryRoutes {


    public routes(server: Application) {



        server.route('/api/ecommerce/store/orders/summary/count/all')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const type = req.query?.type.toString() || 'general';
                    if (!config.cron_jobs_types.includes(type))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'wrong_type_for_retrieve',
                            message: 'Entered wrong type for retrieve'
                        }, res);



                    const data: OrderSummaryDataAllTypes = await getOrderSummaryData.getCasesOrderStatus({
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        order_status: 'all',
                    });

                    if (data === null)
                        return res.status(201).send({
                            code: 201,
                            type: 'no_records_exist',
                            message: 'There aren\'t records yet. Please try again in some moments'
                        });


                    return res.status(200).send(data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        server.route('/api/ecommerce/store/orders/summary/count/specific')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {


                    const params = {
                        status: req.query?.status.toString() || 'all',
                        dateRange: req.query?.dateRange.toString() || 'all',
                        start_date: null,
                        end_date: null,
                        date: null,
                    };

                    if (params.status !== 'all' && params.status !== 'general' && params.status !== 'confirmed' && params.status !== 'sent'
                        && params.status !== 'completed' && params.status !== 'archived' && params.status !== 'archived' && params?.status !== 'returned')
                        return utils.errorHandlingReturn({
                            code: 402,
                            type: 'wrong_status_value',
                            message: 'The status value that you entered is wrong. See the documentation and try again',
                        }, res);


                    if (!config.cron_jobs_types.includes(params.dateRange) && params.dateRange !== 'all' && params.dateRange !== 'range'
                        && params.dateRange !== 'day')
                        return utils.errorHandlingReturn({
                            code: 401,
                            type: 'wrong_type_value',
                            message: 'The type that you entered is wrong. See the documentation and try again',
                        }, res);


                    if (req.query?.startDate)
                        params.start_date = params.dateRange === 'range' ? req.query?.startDate.toString() : null;

                    if (req.query?.endDate)
                        params.end_date = params.dateRange === 'range' ? req.query?.endDate.toString() : null;


                    if (params.dateRange === 'range' && (params.start_date === null || params.end_date === null))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_date_range',
                            message: 'Once you choose the date range option you should parse the startDate and the endDate',
                        }, res);


                    if (req.query?.date)
                        params.date = params.dateRange === 'day' ? req.query?.date.toString() : null;








                    if (params.dateRange === 'all') {
                        // parse all (general, yearly, monthly, weekly)

                        const data: OrderSummaryDataAllTypes = await getOrderSummaryData.getCasesOrderStatus({
                            connected_account_id: utils.findAccountIDFromSessionObject(req),
                            order_status: params.status
                        });

                        if (data === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'no_records_exist',
                                message: 'There aren\'t records yet. Please try again in some moments'
                            }, res);


                        return res.status(200).send(data);
                    } else if (params.dateRange !== 'range' && params.dateRange !== 'day') {

                        const data: OrderSummaryDataAllTypes = await getOrderSummaryData.getCasesOrderStatus({
                            connected_account_id: utils.findAccountIDFromSessionObject(req),
                            order_status: params.status,
                            type: params.dateRange
                        });

                        if (data === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'no_records_exist',
                                message: 'There aren\'t records yet. Please try again in some moments'
                            }, res);


                        return res.status(200).send(data[`${params.dateRange}_type`]);

                    } else if (params.dateRange === 'range') {

                        const data: OrderSummaryDataAllTypes = await getOrderSummaryData.getOrderSummaryTypeRange({
                            connected_account_id: utils.findAccountIDFromSessionObject(req),
                            order_status: params.status,
                            start_date: params.start_date,
                            end_date: params.end_date
                        });

                        if (data === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'no_records_exist',
                                message: 'There aren\'t records yet. Please try again in some moments'
                            }, res);


                        return res.status(200).send(data.range_type);

                    } else if (params.dateRange === 'day') {

                        const data: OrderSummaryDataAllTypes = await getOrderSummaryData.getOrderSummaryTypeDay({
                            connected_account_id: utils.findAccountIDFromSessionObject(req),
                            order_status: params.status,
                            date: params.date,
                        });

                        if (data === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'no_records_exist',
                                message: 'There aren\'t records yet. Please try again in some moments'
                            }, res);



                        return res.status(200).send(data.day_type);

                    }



                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/ecommerce/store/orders/summary/count/spec-date-range')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params = {
                        type: req.query?.type.toString() || 'yearly',
                        date: req.query?.date.toString() || new Date().toLocaleDateString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };
                    if (!config.cron_jobs_types.includes(params.type))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'wrong_type_parameter',
                            message: 'You entered wrong value in type parameter. See the documentation and try again'
                        }, res);



                    const data: OrderSummaryData = await getOrderSummaryData.getOrderSummaryOnlyOne(params);



                    return res.status(200).send(data);


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
