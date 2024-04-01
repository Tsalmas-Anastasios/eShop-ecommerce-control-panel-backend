import { Request } from 'express';
import { utils } from '../../../lib/utils.service';
import { QueryResult, mysql } from '../../../lib/connectors/mysql';
import { config } from '../../../config';
import { graphql } from 'graphql';
import { schema } from '../../../graphql/Schema';

import { OrderSentMailDataProduct } from '../../../models';



class OrderProductsListEmailOrderSent {

    async getProductsListHTML(params: { order_id: string, connected_account_id: string }, req?: Request): Promise<OrderSentMailDataProduct[]> {

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
                        orderSentEmail${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            product_id
                            quantity
                            supplied_customer_price
                            connected_account_id
                            product_info
                            images{
                                id
                                url
                                main_image
                                archived
                            }
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orderProducts = result.data.orderSentEmail as OrderSentMailDataProduct[];

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async createProductCards(params: { order_id: string, connected_account_id: string }, req?: Request): Promise<string> {

        try {

            const products: OrderSentMailDataProduct[] = await this.getProductsListHTML(params);

            let html_string = '';
            for (let i = 0; i < products.length; i++) {
                let image = '';
                for (const json_image of products[0].images)
                    if (json_image.main_image && !json_image.archived)
                        image = json_image.url;

                html_string += `
                    <div class="product-card">
                        <div class="img">
                            <img src="${image}" alt="product-image" />
                        </div>

                        <div class="details">
                            <div class="headline">
                                ${products[i].product_info.headline} ${products[i].product_info.product_brand}
                                ${products[i].product_info.product_model}
                            </div>
                            <div class="product-code">${products[i].product_info.product_code}</div>
                            <div class="price-stock">
                                <div class="stock"><span>Pieces</span> ${products[i].quantity}</div>
                                <div class="price">${products[i].supplied_customer_price} €</div>
                            </div>
                        </div>
                    </div>
                `;
            }


        } catch (error) {
            return Promise.reject(error);
        }

    }

}


const orderProductsListEmailOrderSent = new OrderProductsListEmailOrderSent();
export { orderProductsListEmailOrderSent };
