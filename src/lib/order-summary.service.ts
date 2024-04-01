import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { OrderSummaryData, OrderSummaryDataAllTypes } from '../models';





class GetOrderSummaryData {


    async getCasesOrderStatus(data: {
        connected_account_id: string,
        order_status?: string,
        type?: string,
        start_date?: string,
        end_date?: string,
        date?: string
    }): Promise<OrderSummaryDataAllTypes> {

        try {

            let where_query = '';
            if (data?.order_status)
                if (data.order_status !== 'all')
                    if (data.order_status !== 'general')
                        where_query += `status = '${data.order_status}'`;
                    else
                        where_query += `status = NULL`;


            if (data?.type)
                if (data.type === 'range') {

                    const new_created_at_query = utils.createQueryInitializeDateRange({
                        date_range: 'range',
                        table_column: 'created_at',
                        start_date: data?.start_date || null,
                        end_date: data?.end_date || null,
                    });

                    if (new_created_at_query === null)
                        return Promise.reject('No valid dates given');

                    where_query += ` ${where_query !== '' ? `AND` : ``} ${new_created_at_query}`;

                } else if (data.type === 'day') {

                    const new_created_at_query = utils.createQueryInitializeDateRange({
                        date_range: 'day',
                        table_column: 'created_at',
                        date: data?.date || null
                    });

                    if (new_created_at_query === null)
                        return Promise.reject('No valid dates given');

                    where_query += ` ${where_query !== `` ? `AND` : ``} ${new_created_at_query}`;

                } else if (data.type !== 'all')
                    where_query += ` ${where_query !== '' ? `AND` : ``} type = '${data.type}'`;





            const result = await mysql.query(`
                SELECT
                    sum, DISTINCT status
                    ${data.type !== 'range' && data.type !== 'day' ? `, DISTINCT type` : ``}
                FROM
                    orders_calc_sum
                WHERE
                    connected_account_id = :connected_account_id
                    ${where_query !== `` ? ` AND ${where_query}` : ``}
                ORDER BY created_at DESC, type;
            `, {
                connected_account_id: data.connected_account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);


            const promise_data = new OrderSummaryDataAllTypes();
            if (data.type !== 'range' && data.type !== 'day')
                for (let i = 0; i < result.rowsCount; i++)
                    if (result.rows[i].status === null)
                        promise_data[`${result.rows[i].type}_type`][`all_orders`] = result.rows[i].sum;
                    else
                        promise_data[`${result.rows[i].type}_type`][`${result.rows[i].status}_orders`] = result.rows[i].sum;
            else
                for (let i = 0; i < result.rowsCount; i++)
                    if (result.rows[i] === null)
                        promise_data.range_type[`all_orders`] = result.rows[i].sum;
                    else
                        promise_data.range_type[`${result.rows[i].status}_orders`] = result.rows[i].sum;


            return Promise.resolve(promise_data);

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async getOrderSummaryTypeRange(data: {
        connected_account_id: string,
        order_status?: string,
        start_date: string,
        end_date: string,
    }) {

        try {

            let where_query = utils.createQueryInitializeDateRange({
                date_range: 'range',
                table_column: 'created_at',
                start_date: data?.start_date || null,
                end_date: data?.end_date || null,
            });

            if (where_query === null)
                return Promise.reject(`No valid dates given`);


            if (data?.order_status)
                if (data.order_status !== 'all')
                    if (data.order_status !== 'general')
                        where_query += ` AND status = '${data.order_status}'`;
                    else
                        where_query += `AND status = NULL`;



            const result = await mysql.query(`
                SELECT
                    COUNT(order_id) as orders_count, DISTINCT status
                FROM
                    orders
                WHERE
                    connected_account_id = :connected_account_id AND
                    ${where_query};
            `, {
                connected_account_id: data.connected_account_id
            });


            const promise_data = new OrderSummaryDataAllTypes();
            for (let i = 0; i < result.rowsCount; i++)
                if (result.rows[i] === null)
                    promise_data.range_type[`all_orders`] = result.rows[i].orders_count;
                else
                    promise_data.range_type[`${result.rows[i].status}_orders`] = result.rows[i].orders_count;


            return Promise.resolve(promise_data);

        } catch (error) {
            return Promise.resolve(error);
        }

    }




    async getOrderSummaryTypeDay(data: {
        connected_account_id: string,
        order_status?: string,
        date: string,
    }) {

        try {

            let where_query = utils.createQueryInitializeDateRange({
                date_range: 'day',
                table_column: 'created_at',
                date: data.date,
            });


            if (data?.order_status)
                if (data.order_status !== 'all')
                    if (data.order_status !== 'general')
                        where_query += `status = '${data.order_status}'`;
                    else
                        where_query += `status = NULL`;


            const result = await mysql.query(`
                SELECT
                    COUNT(order_id) as orders_count, DISTINCT status
                FROM
                    orders
                WHERE
                    connected_account_id = :connected_account_id AND
                    ${where_query};
            `, {
                connected_account_id: data.connected_account_id
            });


            const promise_data = new OrderSummaryDataAllTypes();
            for (let i = 0; i < result.rowsCount; i++)
                if (result.rows[i] === null)
                    promise_data.day_type[`all_orders`] = result.rows[i].orders_count;
                else
                    promise_data.day_type[`${result.rows[i].status}_orders`] = result.rows[i].orders_count;

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async getOrderSummaryOnlyOne(data: {
        type: string,
        date: string,
        connected_account_id: string
    }): Promise<OrderSummaryData> {

        try {

            const where_query_created_at = utils.createQueryInitializeDateRangeByDateType({
                type: data.type,
                date: data.date,
                table_column: `created_at`
            });


            const result = await mysql.query(`
                SELECT
                    sum, DISTINCT status
                FROM
                    orders_calc_sum
                WHERE
                    ${where_query_created_at} AND
                    connected_account_id = :connected_account_id AND
                    type = :type
                ORDER BY created_at DESC;
            `, {
                connected_account_id: data.connected_account_id,
                type: data.type
            });



            const promise_data: OrderSummaryData = null;
            for (let i = 0; i < result.rowsCount; i++)
                if (result.rows[i].type === null)
                    promise_data[`all_orders`] = result.rows[i].sum;
                else
                    promise_data[`${result.rows[i].type}_orders`] = result.rows[i].sum;



            return Promise.resolve(promise_data);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





const getOrderSummaryData = new GetOrderSummaryData();
export { getOrderSummaryData };
