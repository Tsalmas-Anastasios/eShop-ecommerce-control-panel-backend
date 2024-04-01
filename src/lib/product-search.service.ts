import { Request } from 'express';
import {
    PromiseProductsModeling, ProductSearchParams
} from '../models';
import { utils } from './utils.service';
import { QueryResult, mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';





class ProductsListFromSearchService {


    async searchProductsList(params: ProductSearchParams, req?: Request): Promise<PromiseProductsModeling[]> {

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
                        productSearch${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            product_id
                            headline
                            product_brand
                            categories_belongs
                            product_code
                            product_model
                            stock
                            clear_price
                            fee_percent
                            fees
                            current_status

                            images{
                                url
                                main_image
                            }
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const searched_products: PromiseProductsModeling[] = result.data.productSearch as PromiseProductsModeling[];

            return Promise.resolve(searched_products);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}


const productsListFromSearchService = new ProductsListFromSearchService();
export { productsListFromSearchService };
