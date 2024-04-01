import { TotalSalesAmountAllCategories } from './../models/TotalSalesAmount';
import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import {
    DashboardStats, DashboardStatsOrdersPerMonths, DashboardStatsMonths, DashboardStatsOrderAnalyticsMonths
} from '../models';
import { createdAtCreationStringService } from '../scheduled-tasks/services/created_at-creation.service';



class GetDashboardStatsTotalSalesAmountService {


    async getIncomesMonthlyAndBefore(connected_account_id: string): Promise<{ current_month: number; before_month: number; }> {


        try {

            const today = utils.moment(new Date()).format('YYYY/MM/DD');
            const today_analysis = today.split('/');        // [0] --> year, [1] --> month, [2] --> day

            let before_month_date = '';
            if (Number(today_analysis[1]) === 1)
                before_month_date = `${Number(today_analysis[0]) - 1}/12/08`;
            else {
                const month_number = Number(today_analysis[1]) <= 10 ? `0${Number(today_analysis[1])} - 1` : (Number(today_analysis[1]) - 1);
                before_month_date = `${today_analysis[0]}/${month_number}/08`;
            }



            const result = await mysql.query(`
                SELECT amount FROM total_sales_amount WHERE type = 'monthly' AND connected_account_id = :connected_account_id ORDER BY created_at DESC LIMIT 1;

                SELECT
                    amount
                FROM
                    total_sales_amount
                WHERE
                    type = 'monthly' AND
                    connected_account_id = :connected_account_id AND
                    ${createdAtCreationStringService.createString({ range: 'monthly', date: before_month_date, table_field: 'created_at' })};
            `, { connected_account_id: connected_account_id });


            const total_incomes: {
                current_month: number;
                before_month: number;
            } = {
                current_month: 0,
                before_month: 0,
            };

            if (result.rowsCount === 0)
                return Promise.resolve(total_incomes);

            total_incomes.current_month = result.rows[0][0]?.amount || 0;
            total_incomes.before_month = result.rows[0][1]?.amount || 0;


            return Promise.resolve(total_incomes);

        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }


    }




    async getTotalSalesPerMonth(connected_account_id: string): Promise<DashboardStatsMonths> {

        try {


            const today = utils.moment(new Date()).format('YYYY/MM/DD');
            const year = today.split('/')[0];

            let sql_query = '';
            for (let i = 1; i <= 12; i++) {
                const month = i < 10 ? `0${i}` : `${i}`;

                sql_query += `
                    SELECT
                        amount
                    FROM
                        total_sales_amount
                    WHERE
                        connected_account_id = :connected_account_id AND
                        ${createdAtCreationStringService.createString({ range: 'monthly', date: `${year}/${month}/12`, table_field: 'created_at' })} AND
                        type = 'monthly'
                    ORDER BY
                        created_at DESC
                    LIMIT 1;
                `;
            }

            const result = await mysql.query(sql_query, { connected_account_id: connected_account_id });


            const stats: DashboardStatsMonths = new DashboardStatsMonths();

            if (result.rowsCount === 0)
                return Promise.resolve(stats);



            stats.january = result.rows[0]?.amount || 0;
            stats.february = result.rows[1]?.amount || 0;
            stats.march = result.rows[2]?.amount || 0;
            stats.april = result.rows[3]?.amount || 0;
            stats.may = result.rows[4]?.amount || 0;
            stats.june = result.rows[5]?.amount || 0;
            stats.july = result.rows[6]?.amount || 0;
            stats.august = result.rows[7]?.amount || 0;
            stats.september = result.rows[8]?.amount || 0;
            stats.october = result.rows[9]?.amount || 0;
            stats.november = result.rows[10]?.amount || 0;
            stats.december = result.rows[11]?.amount || 0;


            return Promise.resolve(stats);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class GetDashboardStatsOrdersService {



    async getOrderMonthlyAndBefore(connected_account_id: string): Promise<{ current_month: number; last_month: number }> {

        try {

            const today = utils.moment(new Date()).format('YYYY/MM/DD');
            const today_analysis = today.split('/');        // [0] --> year, [1] --> month, [2] --> day

            let before_month_date = '';
            if (Number(today_analysis[1]) === 1)
                before_month_date = `${Number(today_analysis[0]) - 1}/12/08`;
            else {
                const month_number = Number(today_analysis[1]) <= 10 ? `0${Number(today_analysis[1])} - 1` : (Number(today_analysis[1]) - 1);
                before_month_date = `${today_analysis[0]}/${month_number}/08`;
            }


            const result = await mysql.query(`
                SELECT sum FROM orders_calc_sum WHERE connected_account_id = :connected_account_id AND type = 'monthly' AND status IS NULL ORDER BY created_at DESC LIMIT 1;

                SELECT
                    sum
                FROM
                    orders_calc_sum
                WHERE
                    connected_account_id = :connected_account_id AND
                    type = 'monthly' AND
                    ${createdAtCreationStringService.createString({ range: 'monthly', date: before_month_date, table_field: 'created_at' })}
                    AND status IS NULL;
            `, { connected_account_id: connected_account_id });


            const total_orders: {
                current_month: number;
                last_month: number;
            } = {
                current_month: 0,
                last_month: 0,
            };

            if (result.rowsCount === 0)
                return Promise.resolve(total_orders);


            total_orders.current_month = result.rows[0][0]?.sum || 0;
            total_orders.last_month = result.rows[0][1]?.sum || 0;


            return Promise.resolve(total_orders);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getOrderMonthlyByStatus(connected_account_id: string): Promise<{
        confirmed_orders: number;
        sent_orders: number;
        completed_orders: number;
        archived_orders: number;
        returned_orders: number;
    }> {

        try {


            const order_statuses = ['confirmed', 'sent', 'completed', 'archived', 'returned'];
            let sql_query = '';

            for (const status of order_statuses)
                sql_query += `
                    SELECT
                        sum, status
                    FROM
                        orders_calc_sum
                    WHERE
                        connected_account_id = '${connected_account_id}' AND
                        type = 'monthly' AND
                        status = '${status}'
                    ORDER BY
                        created_at DESC
                    LIMIT 1;
                `;


            const result = await mysql.query(sql_query);


            const monthly_orders: {
                confirmed_orders: number;
                sent_orders: number;
                completed_orders: number;
                archived_orders: number;
                returned_orders: number;
            } = {
                confirmed_orders: 0,
                sent_orders: 0,
                completed_orders: 0,
                archived_orders: 0,
                returned_orders: 0,
            };

            if (result.rowsCount === 0)
                return Promise.resolve(monthly_orders);



            for (let i = 0; i < result.rows[0].length; i++)
                monthly_orders[`${result.rows[0][i]?.status}_orders` || 'confirmed_orders'] = result.rows[0][i]?.sum || 0;



            return Promise.resolve(monthly_orders);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    /**
     *
     * Function to calculate the sum of each month for each status and for all
     * statuses together
     */
    async getOrderAnalyticsAllMonths(connected_account_id: string): Promise<DashboardStatsOrderAnalyticsMonths> {

        try {

            const today = utils.moment(new Date()).format('YYYY/MM/DD');
            const year = today.split('/')[0];

            let sql_query = '';
            for (let i = 1; i <= 12; i++) {
                const month = i < 10 ? `0${i}` : `${i}`;

                sql_query += `
                    SELECT
                        status, sum, type
                    FROM
                        orders_calc_sum
                    WHERE
                        connected_account_id = :connected_account_id AND
                        ${createdAtCreationStringService.createString({ range: 'monthly', date: `${year}/${month}/12`, table_field: 'created_at' })} AND
                        type = 'monthly'
                    ORDER BY
                        created_at DESC
                    LIMIT 6;
                `;
            }

            const result = await mysql.query(sql_query, { connected_account_id: connected_account_id });


            const data: DashboardStatsOrderAnalyticsMonths = new DashboardStatsOrderAnalyticsMonths();

            if (result.rowsCount === 0)
                return Promise.resolve(data);




            // january
            if (result.rows[0].length > 0)
                for (let i = 0; i < result.rows[0].length; i++)
                    data.january[`${result.rows[0][i]?.status || 'total'}_orders`] = result.rows[0][i]?.sum || 0;

            // february
            if (result.rows[1].length > 0)
                for (let i = 0; i < result.rows[1].length; i++)
                    data.february[`${result.rows[1][i]?.status || 'total'}_orders`] = result.rows[1][i]?.sum || 0;

            // march
            if (result.rows[2].length > 0)
                for (let i = 0; i < result.rows[2].length; i++)
                    data.march[`${result.rows[2][i]?.status || 'total'}_orders`] = result.rows[2][i]?.sum || 0;

            // april
            if (result.rows[3].length > 0)
                for (let i = 0; i < result.rows[3].length; i++)
                    data.april[`${result.rows[3][i]?.status || 'total'}_orders`] = result.rows[3][i]?.sum || 0;

            // may
            if (result.rows[4].length > 0)
                for (let i = 0; i < result.rows[4].length; i++)
                    data.may[`${result.rows[4][i]?.status || 'total'}_orders`] = result.rows[4][i]?.sum || 0;

            // june
            if (result.rows[5].length > 0)
                for (let i = 0; i < result.rows[5].length; i++)
                    data.june[`${result.rows[5][i]?.status || 'total'}_orders`] = result.rows[5][i]?.sum || 0;

            // july
            if (result.rows[6].length > 0)
                for (let i = 0; i < result.rows[6].length; i++)
                    data.july[`${result.rows[6][i]?.status || 'total'}_orders`] = result.rows[6][i]?.sum || 0;

            // august
            if (result.rows[7].length > 0)
                for (let i = 0; i < result.rows[7].length; i++)
                    data.august[`${result.rows[7][i]?.status || 'total'}_orders`] = result.rows[7][i]?.sum || 0;

            // september
            if (result.rows[8].length > 0)
                for (let i = 0; i < result.rows[8].length; i++)
                    data.september[`${result.rows[8][i]?.status || 'total'}_orders`] = result.rows[8][i]?.sum || 0;

            // october
            if (result.rows[9].length > 0)
                for (let i = 0; i < result.rows[9].length; i++)
                    data.october[`${result.rows[9][i]?.status || 'total'}_orders`] = result.rows[9][i]?.sum || 0;

            // november
            if (result.rows[10].length > 0)
                for (let i = 0; i < result.rows[10].length; i++)
                    data.november[`${result.rows[10][i]?.status || 'total'}_orders`] = result.rows[10][i]?.sum || 0;

            // december
            if (result.rows[11].length > 0)
                for (let i = 0; i < result.rows[11].length; i++)
                    data.december[`${result.rows[11][i]?.status || 'total'}_orders`] = result.rows[11][i]?.sum || 0;


            return Promise.resolve(data);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}










const getDashboardStatsTotalSalesAmountService = new GetDashboardStatsTotalSalesAmountService();
const getDashboardStatsOrdersService = new GetDashboardStatsOrdersService();
export { getDashboardStatsTotalSalesAmountService, getDashboardStatsOrdersService };
