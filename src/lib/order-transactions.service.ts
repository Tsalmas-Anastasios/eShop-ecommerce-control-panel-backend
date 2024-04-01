import { Request } from 'express';
import {
    OrderTransaction
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';






class OrderTransactionsGetListService {


    async getList(params: {
        order_id: string,
        page: number,
        connected_account_id: string
    }, req: Request): Promise<OrderTransaction[]> {

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
                        orderTransactions${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            order_id
                            connected_account_id
                            updated_by
                            order_created_at
                            order_seen
                            whole_order_updated
                            status_updated
                            status_before
                            status_after
                            field_changed
                            value_before
                            value_after
                            created_at
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const order_transactions: OrderTransaction[] = result.data.orderTransactions as OrderTransaction[];


            return Promise.resolve(order_transactions);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}


const orderTransactionsGetListService = new OrderTransactionsGetListService();
export { orderTransactionsGetListService };
