import { Request } from 'express';
import {
    OrderSearchParams, PromiseOrdersModeling
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';





class OrdersListFromSearchService {


    async searchOrdersList(params: OrderSearchParams, req?: Request): Promise<PromiseOrdersModeling[]> {

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
                        orderSearch${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            order_id
                            order_number
                            first_name
                            last_name
                            phone
                            email
                            confirm_date
                            order_total
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const searched_orders: PromiseOrdersModeling[] = result.data.orderSearch as PromiseOrdersModeling[];

            return Promise.resolve(searched_orders);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



const ordersListFromSearchService = new OrdersListFromSearchService();
export { ordersListFromSearchService };
