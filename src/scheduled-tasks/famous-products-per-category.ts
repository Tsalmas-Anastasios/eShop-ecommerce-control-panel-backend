import { CronJob } from 'cron';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';
import { createdAtCreationStringService } from './services/created_at-creation.service';

import { productsIDNumbersGenerator } from '../lib/id_numbers_generators/products';







export class FamousProductsPerCategoryCalc {

    private cronJobFamousProductsCalcTime = '*/120 * * * *';


    public cronJobFamousProductsPerCategory(): CronJob {

        return new CronJob(this.cronJobFamousProductsCalcTime, async () => {

            try {

                const accounts: string[] = await utils.getActivatedAccounts();


                let sql_insertion_query = '';

                for (const account of accounts) {

                    const product_categories_result = await mysql.query(`
                        SELECT
                            pcategory_id, label
                        FROM
                            product_categories
                        WHERE
                            connected_account_id = :connected_account_id
                    `, { connected_account_id: account });

                    if (product_categories_result.rowsCount === 0)
                        continue;


                    const categories_obj = {};
                    for (let i = 0; i < product_categories_result.rowsCount; i++)
                        categories_obj[product_categories_result.rows[i].pcategory_id] = product_categories_result.rows[i].label;


                    const product_categories_array = Object.entries(categories_obj);


                    for (const product_category of product_categories_array)
                        for (const range of config.cron_jobs_types) {
                            const date_query = createdAtCreationStringService.createString({ range: range, table_field: 'confirm_date' });


                            const inside_result = await mysql.query(`
                                SELECT
                                    order_products.product_id, order_products.quantity
                                FROM
                                    orders
                                INNER JOIN
                                    order_products ON orders.order_id = order_products.order_id
                                INNER JOIN
                                    products ON order_products.product_id = products.product_id
                                WHERE
                                    orders.connected_account_id = :connected_account_id AND
                                    products.categories_belongs LIKE '%%"${product_category[0]}": "${product_category[1]}"%%'
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
                                        famous_products_per_category
                                    SET
                                        rec_id = '${productsIDNumbersGenerator.getNewFamousProductID()}',
                                        product_id = '${product.product_id}',
                                        products_category_id = '${product_category[0]}',
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

