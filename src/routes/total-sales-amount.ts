import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { TotalSalesAmountAllCategories } from '../models';

import { getTotalSalesAmountService } from '../lib/total-sales-amount.service';




export class TotalSalesAmountRoutes {


    public routes(server: Application) {


        server.route('/api/stats/total-sales-amount/spec-date-range')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params = {
                        type: req.query?.type.toString() || 'general',
                        date: req.query?.date.toString() || new Date().toLocaleDateString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };
                    if (!config.cron_jobs_types.includes(params.type))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'wrong_type_parameter',
                            message: 'You entered wrong value in type parameter. See the documentation and try again'
                        }, res);



                    const amount = await getTotalSalesAmountService.getTotalSalesAmountOnlyOne(params);


                    return res.status(200).send({
                        code: 200,
                        type: 'amount',
                        date: params.date,
                        amount: amount
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/stats/total-sales-amount/all-types')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params = {
                        date: req.query?.date.toString() || new Date().toLocaleDateString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const data: TotalSalesAmountAllCategories = await getTotalSalesAmountService.getTotalSalesAmountAllCategories(params);

                    return res.status(200).send(data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }


}
