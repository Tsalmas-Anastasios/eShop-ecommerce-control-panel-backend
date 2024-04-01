import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { TotalSalesAmountAllCategories } from '../models';





class GetTotalSalesAmountService {


    async getTotalSalesAmountOnlyOne(data: {
        type: string,
        date: string,
        connected_account_id: string,
    }): Promise<number> {

        try {

            const where_query_created_at = utils.createQueryInitializeDateRangeByDateType({
                type: data.type,
                date: data.date,
                table_column: `created_at`
            });




            const result = await mysql.query(`
                SELECT
                    amount, DISTINCT type
                FROM
                    total_sales_amount
                WHERE
                    ${where_query_created_at} AND
                    connected_account_id = :connected_account_id AND
                    type = :type
                ORDER BY created_at DESC;
            `);



            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0].amount as number);

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async getTotalSalesAmountAllCategories(data: {
        date: string,
        connected_account_id: string,
    }): Promise<TotalSalesAmountAllCategories> {

        try {

            const promise_data: TotalSalesAmountAllCategories = {
                general_amount: null,
                yearly_amount: null,
                monthly_amount: null,
                weekly_amount: null,
            };


            // general type
            let result = await mysql.query(`
                SELECT
                    amount
                FROM
                    total_sales_amount
                WHERE
                    type = 'general' AND
                    connected_account_id = :connected_account_id
                ORDER BY created_at DESC
                LIMIT 1
            `, { connected_account_id: data.connected_account_id });

            if (result.rowsCount === 0)
                promise_data.general_amount = null;
            else
                promise_data.general_amount = result.rows[0].amount as number;



            // yearly type
            let where_query_created_at = utils.createQueryInitializeDateRangeByDateType({
                type: 'yearly',
                date: data.date,
                table_column: 'created_at'
            });
            result = await mysql.query(`
                SELECT
                    amount
                FROM
                    total_sales_amount
                WHERE
                    type = 'yearly' AND
                    connected_account_id = :connected_account_id AND
                    ${where_query_created_at}
                ORDER BY created_at DESC
                LIMIT 1
            `, { connected_account_id: data.connected_account_id });

            if (result.rowsCount === 0)
                promise_data.yearly_amount = null;
            else
                promise_data.yearly_amount = result.rows[0].amount as number;



            // monthly type
            where_query_created_at = utils.createQueryInitializeDateRangeByDateType({
                type: 'monthly',
                date: data.date,
                table_column: 'created_at'
            });
            result = await mysql.query(`
                SELECT
                    amount
                FROM
                    total_sales_amount
                WHERE
                    type = 'monthly' AND
                    connected_account_id = :connected_account_id AND
                    ${where_query_created_at}
                ORDER BY created_at DESC
                LIMIT 1
            `, { connected_account_id: data.connected_account_id });

            if (result.rowsCount === 0)
                promise_data.monthly_amount = null;
            else
                promise_data.monthly_amount = result.rows[0].amount as number;



            // weekly type
            where_query_created_at = utils.createQueryInitializeDateRangeByDateType({
                type: 'weekly',
                date: data.date,
                table_column: 'created_at',
            });
            result = await mysql.query(`
                SELECT
                    amount
                FROM
                    total_sales_amount
                WHERE
                    type = 'weekly' AND
                    connected_account_id = :connected_account_id AND
                    ${where_query_created_at}
                ORDER BY  created_at DESC
                LIMIT 1
            `, { connected_account_id: data.connected_account_id });

            if (result.rowsCount === 0)
                promise_data.weekly_amount = null;
            else
                promise_data.weekly_amount = result.rows[0].amount as number;



            return Promise.resolve(promise_data);

        } catch (error) {
            return Promise.reject(error);
        }

    }




}



const getTotalSalesAmountService = new GetTotalSalesAmountService();
export { getTotalSalesAmountService };
