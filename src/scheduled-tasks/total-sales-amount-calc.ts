import { CronJob } from 'cron';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';
import { createdAtCreationStringService } from './services/created_at-creation.service';

import { totalSalesAmountIDNumberGenerator } from '../lib/id_numbers_generators/total-sales-amount';



export class TotalSalesAmountCalc {


    private cronJobTotalSalesAmountTime = '*/30 * * * *';




    public cronJobTotalSalesAmount(): CronJob {

        return new CronJob(this.cronJobTotalSalesAmountTime, async () => {


            try {

                const accounts: string[] = await utils.getActivatedAccounts();


                let sql_insertion_query = '';
                for (let i = 0; i < config.cron_jobs_types.length; i++) {
                    const date_query = createdAtCreationStringService.createString({
                        range: config.cron_jobs_types[i],
                        table_field: 'completed_date',
                    });


                    for (const account of accounts)
                        sql_insertion_query += `
                            INSERT INTO
                                total_sales_amount
                            SET
                                rec_id = '${totalSalesAmountIDNumberGenerator.getNewTotalSalesID()}',
                                amount = (SELECT
                                                SUM(clear_value)
                                            FROM
                                                orders
                                            WHERE
                                                connected_account_id = '${account}'
                                                ${date_query !== `` ? `AND ${date_query}` : ``}
                                                ${date_query === '' ? `AND completed_date IS NOT NULL` : ``}),
                                connected_account_id = '${account}',
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
