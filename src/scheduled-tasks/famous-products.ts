import { CronJob } from 'cron';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';
import { createdAtCreationStringService } from './services/created_at-creation.service';

import { productsIDNumbersGenerator } from '../lib/id_numbers_generators/products';







export class FamousProductsCalc {

    private cronJobFamousProductsCalcTime = '*/60 * * * *';


    public cronJobFamousProducts(): CronJob {

        return new CronJob(this.cronJobFamousProductsCalcTime, async () => {

            try {

                const accounts: string[] = await utils.getActivatedAccounts();




                let sql_insertion_query = '';
                for (const range of config.cron_jobs_types) {
                    const date_query = createdAtCreationStringService.createString({ range: range, table_field: 'confirm_date' });

                    for (const account of accounts) {

                        // find the completed orders of each account
                        let inside_result = await mysql.query(`
                            SELECT
                                order_id
                            FROM
                                orders
                            WHERE
                                connected_account_id = :connected_account_id
                                ${date_query !== `` ? `AND ${date_query}` : ``}
                        `, { connected_account_id: account });

                        const orders: string[] = [];
                        let query_where_string = '';
                        for (let i = 0; i < inside_result.rowsCount; i++) {
                            orders.push(inside_result.rows[i].order_id.toString());
                            query_where_string += `OR order_id = '${inside_result.rows[i].order_id.toString()}' `;
                        }
                        query_where_string = query_where_string.replace(/^.{3}/g, '');


                        // product counting
                        inside_result = await mysql.query(`
                            SELECT
                                product_id, quantity
                            FROM
                                order_products
                            WHERE
                                connected_account_id = :connected_account_id
                                ${query_where_string !== '' ? ` AND ${query_where_string}` : ``}
                        `, { connected_account_id: account });


                        let products_file: {
                            product_id: string;
                            count: number;
                        }[] = [];
                        for (let i = 0; i < inside_result.rowsCount; i++) {
                            let flag = false;
                            for (const product of products_file)
                                if (product.product_id === inside_result.rows[i].product_id.toString()) {
                                    product.count += Number(inside_result.rows[i].quantity);
                                    flag = true;
                                    break;
                                }

                            if (!flag)
                                products_file.push({
                                    product_id: inside_result.rows[i].product_id.toString(),
                                    count: Number(inside_result.rows[i].quantity),
                                });
                        }



                        // sorting products file based on count DESC
                        products_file.sort((product1, product2) => product2.count - product1.count);

                        if (products_file.length > 15)
                            products_file = products_file.slice(0, 15);




                        let i = 0;
                        for (const product of products_file) {
                            i++;
                            sql_insertion_query += `
                                INSERT INTO
                                    famous_products
                                SET
                                    rec_id = '${productsIDNumbersGenerator.getNewFamousProductID()}',
                                    product_id = '${product.product_id}',
                                    connected_account_id = '${account}',
                                    row_number = ${i},
                                    type = '${range}';
                            `;
                        }


                    }
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

