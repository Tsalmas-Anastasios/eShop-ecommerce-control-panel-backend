import { Request } from 'express';
import {
    ProductCategory
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { productCategoriesIDNumbersGenerator } from './id_numbers_generators/product-categories';




class ProductCategoryListService {


    async getList(params: ProductCategory, req?: Request): Promise<ProductCategory[]> {

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



                const result = await graphql({
                    schema: schema,
                    source: `
                        {
                            productCategories${graphQueryParams !== '()' ? graphQueryParams : ''}{
                                pcategory_id
                                label
                                connected_account_id
                            }
                        }
                    `,
                    contextValue: req || null,
                });


                if (result.errors?.length > 0)
                    return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

                const product_categories = result.data.productCategories as ProductCategory[];

                return Promise.resolve(product_categories);

            }

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getSpecificCategory(params: ProductCategory, req?: Request): Promise<ProductCategory> {

        try {

            const categories: ProductCategory[] = await this.getList(params, req || null);
            if (categories.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(categories[0] as ProductCategory);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class ProductCategoryAddService {


    async addNewCategory(data: { label: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    product_categories
                SET
                    pcategory_id = :pcategory_id,
                    label = :label,
                    connected_account_id = :connected_account_id
            `, {
                pcategory_id: productCategoriesIDNumbersGenerator.getNewProductCategoryID(),
                label: data.label,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class CheckProductCategoryService {


    async productCategoryExists(data: { pcategory_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    pcategory_id
                FROM
                    product_categories
                WHERE
                    pcategory_id = :pcategory_id AND
                    connected_account_id = :connected_account_id;
            `, {
                pcategory_id: data.pcategory_id,
                connected_account_id: data.connected_account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class UpdateProductCategoryService {


    async updateProductCategory(data: ProductCategory): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    product_categories
                SET
                    label = :label
                WHERE
                    pcategory_id = :pcategory_id AND
                    connected_account_id = :connected_account_id
            `, {
                label: data.label,
                pcategory_id: data.pcategory_id,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



const productCategoryListService = new ProductCategoryListService();
const productCategoryAddService = new ProductCategoryAddService();
const checkProductCategoryService = new CheckProductCategoryService();
const updateProductCategoryService = new UpdateProductCategoryService();
export {
    productCategoryListService, productCategoryAddService, checkProductCategoryService, updateProductCategoryService
};
