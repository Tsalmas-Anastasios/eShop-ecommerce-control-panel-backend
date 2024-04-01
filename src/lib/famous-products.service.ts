import { Request } from 'express';
import {
    Product, GraphQlSearchProductsParamsArgs, GraphQlSearchProductsParamsArgsSpecificList,
    GraphQlSearchProductsParamsArgsSpecificProduct, ProductHistory
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { createdAtCreationStringService } from '../scheduled-tasks/services/created_at-creation.service';






class FamousProductsGetListID {


    async getProductsIDDate(params: { type: string, date: string, connected_account_id: string }): Promise<string[]> {

        try {


            const result = await mysql.query(`
                SELECT
                    DISTINCT product_id
                FROM
                    famous_products
                WHERE
                    connected_account_id = :connected_account_id AND
                    ${createdAtCreationStringService.createString({ range: params.type, date: params.date, table_field: 'created_at' })}
                ORDER BY
                    created_at DESC,
                    row_number;
            `, { connected_account_id: params.connected_account_id });



            if (result.rowsCount === 0)
                return Promise.resolve([]);


            const products_id: string[] = [];
            for (let i = 0; i < result.rowsCount; i++)
                products_id.push(result.rows[i].product_id.toString());

            return Promise.resolve(products_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getProductsIDAllTypes(params: { length: number, date: string, type: string, connected_account_id: string }): Promise<string[]> {

        try {

            const result = await mysql.query(`
                SELECT
                    product_id
                FROM
                    famous_products
                WHERE
                    connected_account_id = :connected_account_id AND
                    ${utils.createQueryInitializeDateRangeByUnixEpochDate({ type: params.type, date: params.date, table_column: `created_at` })}
                ORDER BY row_number, created_at DESC
                LIMIT :limit
            `, {
                connected_account_id: params.connected_account_id,
                limit: params.length
            });


            const products_id: string[] = [];
            for (let i = 0; i < result.rowsCount; i++)
                products_id.push(result.rows[i].product_id.toString());


            return Promise.resolve(products_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class FamousProductsCategoriesListIDName {


    async getCategoriesIDName(connected_account_id: string): Promise<string[]> {

        try {

            const result = await mysql.query(`
                SELECT
                    label
                FROM
                    product_categories
                WHERE
                    connected_account_id = :connected_account_id;
            `, { connected_account_id: connected_account_id });


            if (result.rowsCount === 0)
                return Promise.resolve([]);

            const categories = [];
            for (let i = 0; i < result.rowsCount; i++)
                categories.push(result.rows[i].label as string);


            return Promise.resolve(categories);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class FamousProductsGetListProduct {


    async getProducts(params: {
        products: string[],
        connected_account_id: string,
    }, req?: Request): Promise<Product[]> {

        try {

            if (!utils.lodash.isEmpty(params.products) && params.products.length === 0)
                return null;

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
                        famousProducts${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            product_id
                            headline
                            product_brand
                            categories_belongs
                            product_code
                            product_model
                            stock
                            supplied_price
                            clear_price
                            fee_percent
                            fees

                            specification{
                                id
                                category_name

                                fields{
                                    id
                                    specification_field_name
                                    specification_field_value
                                }
                            }

                            product_description
                            supplier
                            current_status
                            archived
                            notes
                            connected_account_id
                            created_at_epoch
                            created_at
                            current_version
                            images{
                                id
                                url
                                main_image
                                archived
                                created_at
                            }
                        }
                    }
                `,
                contextValue: req || null,
            });



            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const products = result.data.famousProducts as Product[];

            return Promise.resolve(products);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






const famousProductsGetListID = new FamousProductsGetListID();
const famousProductsGetListProduct = new FamousProductsGetListProduct();
const famousProductsCategoriesListIDName = new FamousProductsCategoriesListIDName();
export {
    famousProductsGetListID, famousProductsGetListProduct, famousProductsCategoriesListIDName
};
