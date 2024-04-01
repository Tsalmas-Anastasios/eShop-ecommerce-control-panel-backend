import { Request } from 'express';
import {
    ProductTransaction
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';






class ProductsTransactionsGetListService {


    async getList(params: {
        product_id: string,
        page: number,
        connected_account_id: string
    }, req: Request): Promise<ProductTransaction[]> {

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
                        productTransactions${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            product_id
                            connected_account_id
                            updated_by
                            product_created_at
                            whole_product_update
                            product_update_categories
                            added_category
                            removed_category
                            product_update_images
                            field_changed
                            value_before
                            value_after
                            quantity_sold
                            quantity_added
                            quantity_removed
                            warehouse_id
                            runway_id
                            column_id
                            column_shelf_id
                            purchased_price
                            status_changed
                            status_before
                            status_after
                            created_at
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const products_transactions: ProductTransaction[] = result.data.productTransactions as ProductTransaction[];


            return Promise.resolve(products_transactions);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}


const productsTransactionsGetListService = new ProductsTransactionsGetListService();
export { productsTransactionsGetListService };
