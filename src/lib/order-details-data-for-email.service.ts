import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';


import { OrderSentStandardMailData } from '../models';




class OrderSentDataForEmail {

    async getInvoiceAndAddressDetails(params: { order_id: string, connected_account_id: string }, req?: Request): Promise<OrderSentStandardMailData> {

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
                            address
                            postal_code
                            city
                            country
                            phone
                            invoice_data__first_name
                            invoice_data__last_name
                            invoice_data__address
                            invoice_data__postal_code
                            invoice_data__city
                            invoice_data__country
                            invoice_data__phone
                            tracking_number
                            tracking_url
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orders: OrderSentStandardMailData[] = result.data.orders as OrderSentStandardMailData[];

            if (orders.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(orders[0] as OrderSentStandardMailData);

        } catch (error) {
            return Promise.resolve(error);
        }

    }

}


const orderSentDataForEmail = new OrderSentDataForEmail();
export { orderSentDataForEmail };
