import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { OrderPaymentMethod } from '../models';






class OrderPaymentMethodsListService {


    async getList(params?: { active?: number, archived?: number, rec_id?: string }, req?: Request): Promise<OrderPaymentMethod[]> {

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
                        orderPaymentMethods${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            label
                            description
                            service
                            active
                            archived
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const payment_methods: OrderPaymentMethod[] = result.data.orderPaymentMethods as OrderPaymentMethod[];

            return Promise.resolve(payment_methods);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getSpecificItem(params: { active?: number, archived?: number, rec_id: string }, req?: Request): Promise<OrderPaymentMethod> {

        try {

            const payment_methods: OrderPaymentMethod[] = await this.getList(params, req || null);
            if (payment_methods.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(payment_methods[0] as OrderPaymentMethod);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





const orderPaymentMethodsListService = new OrderPaymentMethodsListService();
export { orderPaymentMethodsListService };
