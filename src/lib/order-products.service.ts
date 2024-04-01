import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

// models
import { OrderProducts } from '../models';


class CheckProducts {

    async productExistsOnOrder(params: { order_id: string, product_id: string }, account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    order_products
                WHERE
                    order_id = :order_id,
                    product_id = :product_id;
            `, {
                order_id: params.order_id,
                product_id: params.product_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class OrderProductsList {


    async getProducts(params: { order_id: string, account_id: string, product_id?: string }, req?: Request): Promise<OrderProducts> {
        // when we have 'product_id' parameter, then only one record will be returned

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
                            order_products
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orders = result.data.orders as OrderProducts[];

            return Promise.resolve(orders[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}


const checkProducts = new CheckProducts();
const orderProductsList = new OrderProductsList();
export { checkProducts, orderProductsList };
