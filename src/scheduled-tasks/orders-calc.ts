import { CronJob } from 'cron';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';
import { createdAtCreationStringService } from './services/created_at-creation.service';

import { orderIDNumbersGenerator } from '../lib/id_numbers_generators/orders';







export class OrdersCalcAutoCrons {

    private order_statuses: string[] = [null, 'confirmed', 'sent', 'completed', 'archived', 'returned'];

    private ordersCalcGeneralTime = '*/30 * * * *';


    public ordersCalcGeneral(): CronJob {

        return new CronJob(this.ordersCalcGeneralTime, async () => {

            try {

                const accounts: string[] = await utils.getActivatedAccounts();


                let sql_insertion_query = '';
                for (let i = 0; i < config.cron_jobs_types.length; i++)
                    for (let j = 0; j < this.order_statuses.length; j++) {
                        const date_query = createdAtCreationStringService.createString({
                            range: config.cron_jobs_types[i],
                            table_field: this.order_statuses[j] === 'confirmed' || this.order_statuses[j] === null ? 'confirm_date' : `${this.order_statuses[j]}_date`,
                        });

                        // for each account
                        for (const account of accounts)
                            sql_insertion_query += `
                                INSERT INTO
                                    orders_calc_sum
                                SET
                                    rec_id = '${orderIDNumbersGenerator.getNewOrdersCalcID()}',
                                    connected_account_id = '${account}',
                                    sum = (SELECT
                                                COUNT(order_id)
                                            FROM
                                                orders
                                            WHERE
                                                connected_account_id = '${account}'
                                                ${this.order_statuses[j] !== null ? ` AND current_status = '${this.order_statuses[j]}'` : ''}
                                                ${date_query !== '' ? ` AND ${date_query}` : ``}),
                                    status = ${this.order_statuses[j] === null ? `NULL` : `'${this.order_statuses[j]}'`},
                                    type = '${config.cron_jobs_types[i]}';
                            `;
                    }


                let result: QueryResult;
                if (sql_insertion_query !== '')
                    result = await mysql.query(sql_insertion_query);

            } catch (error) {
                console.log('Error in exiting query.', error);
            }

        }, null, true, 'Europe/Athens');

    }


}
