import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { OrderConfirmationMailUsedData, OrderConfirmationMailUsedDataCompanyBasicData } from '../models';



class OrderRandomData {

    async orderConfirmMailData(params: { order_id?: string, order_number?: string, connected_account_id: string }, req?: Request): Promise<OrderConfirmationMailUsedData> {

        try {

            let graphQueryParams = '';

            if (params && !utils.lodash.isEmpty(params)) {

                graphQueryParams += '(';

                // tslint:disable-next-line:curly
                let i = 0;
                for (const key in params) {
                    if (i > 0)
                        graphQueryParams += ',';

                    if (typeof params[key] === 'number')
                        graphQueryParams += `${key}: ${params[key]}`;
                    else
                        graphQueryParams += `${key}: "${params[key]}"`;
                    i++;

                }

                graphQueryParams += ')';

            }

            const result = await graphql({
                schema: schema,
                source: `
                    {
                        orders${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            shop_logo,
                            shop_url,
                            first_name,
                            last_name,
                            order_number,
                            shop_name,
                            shop_google_rate_url
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orders = result.data.orders as OrderConfirmationMailUsedData[];
            if (orders.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(orders[0] as OrderConfirmationMailUsedData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getOrderEmail(data: { order_id?: string, order_number?: string, connected_account_id: string }): Promise<string> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += ` AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');


            const result = await mysql.query(`
                SELECT
                    email
                FROM
                    orders
                WHERE
                    ${queryWhereClause}
            `);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getOrderNumber(data: { order_id: string, connected_account_id: string }): Promise<string> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');


            const result = await mysql.query(`
                SELECT
                    order_number
                FROM
                    orders
                WHERE
                    ${queryWhereClause}
            `);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


const orderRandomData = new OrderRandomData();
export { orderRandomData };
