import { Request } from 'express';
import {
    Product, GraphQlSearchProductsParamsArgs, GraphQlSearchProductsParamsArgsSpecificList,
    GraphQlSearchProductsParamsArgsSpecificProduct, ProductHistory, ProductSpecificationCategory,
    ProductSpecificationField, ProductTransaction, ProductStock
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { productsIDNumbersGenerator } from './id_numbers_generators/products';
import { productImagesIDNUmbersGeneratorService } from './id_numbers_generators/product-images';




class ProductsList {

    async getProducts(params?: GraphQlSearchProductsParamsArgs, req?: Request): Promise<Product[]> {

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
                        products${graphQueryParams !== '()' ? graphQueryParams : ''}{
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
                            discount_percent
                            discount

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
                            product_shared

                            images{
                                id
                                url
                                main_image
                                archived
                                created_at
                            }

                            product_stock{
                                rec_id
                                product_id
                                connected_account_id
                                warehouse_id
                                runway_id
                                column_id
                                column_shelf_id
                                stock_quantity
                            }

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const products = result.data.products as Product[];

            return Promise.resolve(products);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getProduct(product_id: string, account_id: string, req?: Request): Promise<Product> {

        try {

            let products: Product[];
            products = await this.getProducts({ product_id: product_id, connected_account_id: account_id }, req);

            if (products.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(products[0] as Product);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class SpecificProductsList {

    async getProducts(params: GraphQlSearchProductsParamsArgsSpecificList, req?: Request): Promise<Product[]> {

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
                        products${graphQueryParams !== '()' ? graphQueryParams : ''}{

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
                            discount_percent
                            discount

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
                            product_shared

                            images{
                                id
                                url
                                main_image
                                archived
                                created_at
                            }

                            product_stock{
                                rec_id
                                product_id
                                connected_account_id
                                warehouse_id
                                runway_id
                                column_id
                                column_shelf_id
                                stock_quantity
                            }

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const products = result.data.products as Product[];


            return Promise.resolve(products);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class ProductStockGetListService {


    // async getProductStock(params: { product_id: string, connected_account_id: string }): Promise<ProductStock[]> {

    //     try {



    //     } catch (error) {
    //         return Promise.reject(error);
    //     }

    // }


}




class AddNewProduct {

    async addProduct(data: Product): Promise<any> {

        try {

            const identifiers = {
                product_id: productsIDNumbersGenerator.getNewProductID(),
                product_code: productsIDNumbersGenerator.getNewProductNumber(),
                version_id: productsIDNumbersGenerator.getNewHistoryProductID(),
            };

            const result = await mysql.query(`
                INSERT INTO
                    products
                SET
                    product_id = :product_id,
                    headline = :headline,
                    product_brand = :product_brand,
                    categories_belongs = :categories_belongs,
                    product_code = :product_code,
                    product_model = :product_model,
                    stock = :stock,
                    supplied_price = :supplied_price,
                    clear_price = :clear_price,
                    fee_percent = :fee_percent,
                    fees = :fees,
                    ${data?.discount_percent ? `discount_percent = ${data.discount_percent},` : ``}
                    ${data?.discount ? `discount = ${data.discount},` : ``}
                    product_description = :product_description,
                    ${data?.supplier ? `supplier = '${data.supplier}',` : ``}
                    current_status = :current_status,
                    ${data?.notes ? `notes = '${data.notes}',` : ``}
                    connected_account_id = :connected_account_id,
                    created_at_epoch = :created_at_epoch,
                    current_version = :current_version
            `, {
                product_id: identifiers.product_id,
                headline: data.headline,
                product_brand: data.product_brand,
                categories_belongs: data.categories_belongs,
                product_code: identifiers.product_code,
                product_model: data.product_model,
                stock: data.stock,
                supplied_price: data.supplied_price,
                clear_price: data.clear_price,
                fee_percent: data.fee_percent,
                fees: data.fees,
                product_description: data.product_description,
                current_status: data.current_status,
                connected_account_id: data.connected_account_id,
                created_at_epoch: data.created_at_epoch,
                current_version: identifiers.version_id,
            });


            return Promise.resolve(identifiers);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async addProductToHistory(data: ProductHistory, version_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    products_update_history
                SET
                    rec_id = :rec_id,
                    version = :version,
                    product_id = :product_id,
                    headline = :headline,
                    product_brand = :product_brand,
                    categories_belongs = :categories_belongs,
                    product_code = :product_code,
                    product_model = :product_model,
                    stock = :stock,
                    supplied_price = :supplied_price,
                    clear_price = :clear_price,
                    fee_percent = :fee_percent,
                    fees = :fees,
                    ${data?.discount_percent ? `discount_percent = ${data.discount_percent},` : ``}
                    ${data?.discount ? `discount = ${data.discount},` : ``}
                    product_description = :product_description,
                    ${data?.supplier ? `supplier = '${data.supplier}',` : ``}
                    current_status = :current_status,
                    ${data?.notes ? `notes = '${data.notes}',` : ``}
                    connected_account_id = :connected_account_id,
                    created_at_epoch = :created_at_epoch,
                    version__created_at_epoch = :version__created_at_epoch
            `, {
                rec_id: version_id,
                version: `v0.0`,
                product_id: data.product_id,
                headline: data.headline,
                product_brand: data.product_brand,
                categories_belongs: data.categories_belongs,
                product_code: data.product_code,
                product_model: data.product_model,
                stock: data.stock,
                supplied_price: data.supplied_price,
                clear_price: data.clear_price,
                fee_percent: data.fee_percent,
                fees: data.fees,
                product_description: data.product_description,
                current_status: data.current_status,
                connected_account_id: data.connected_account_id,
                created_at_epoch: data.created_at_epoch,
                version__created_at_epoch: utils.convertToEpoch(new Date().toLocaleDateString()) + 1,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async addProductStock(product: Product): Promise<void> {

        try {

            let sql_query = '';

            for (const stock of product.product_stock)
                sql_query += `
                    INSERT INTO
                        products_stock_warehouses
                    SET
                        rec_id = '${productsIDNumbersGenerator.getProductStockID()}',
                        product_id = :product_id,
                        connected_account_id = :connected_account_id,
                        warehouse_id = '${stock.warehouse_id}',
                        runway_id = '${stock.runway_id}',
                        column_id = '${stock.column_id}',
                        column_shelf_id = '${stock.column_shelf_id}',
                        stock_quantity = ${stock.stock_quantity};
                `;


            const result = await mysql.query(sql_query, { product_id: product.product_id, connected_account_id: product.connected_account_id });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CheckProductService {

    async productExists(data: { product_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    product_id
                FROM
                    products
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id;
            `, {
                product_id: data.product_id,
                connected_account_id: data.connected_account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async productIsShared(params: { product_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    product_id
                FROM
                    products
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id AND
                    product_shared = 1
            `, params);


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class UpdateProductDataService {


    async updateProduct(data: Product, identifiers: { product_id: string, connected_account_id: string }): Promise<string> {

        try {

            const version_id = productsIDNumbersGenerator.getNewHistoryProductID();

            const result = await mysql.query(`
                UPDATE
                    products
                SET
                    ${data?.headline ? `headline = '${data.headline}',` : ``}
                    ${data?.product_brand ? `product_brand = '${data.product_brand}',` : ``}
                    ${data?.categories_belongs ? `categories_belongs = '${data.categories_belongs}',` : ``}
                    ${data?.product_model ? `product_model = '${data.product_model}',` : ``}
                    ${data?.stock ? `stock = ${data.stock},` : ``}
                    ${data?.supplied_price ? `supplied_price = ${data.supplied_price},` : ``}
                    ${data?.clear_price ? `clear_price = ${data.clear_price},` : ``}
                    ${data?.fee_percent ? `fee_percent = ${data.fee_percent},` : ``}
                    ${data?.fees ? `fees = ${data.fees},` : ``}
                    ${data?.discount_percent ? `discount_percent = ${data.discount_percent},` : ``}
                    ${data?.discount ? `discount = ${data.discount},` : ``}
                    ${data?.product_description ? `product_description = '${data.product_description}',` : ``}
                    ${data?.supplier ? `supplier = '${data.supplier}',` : ``}
                    ${data?.current_status ? `current_status = '${data.current_status}',` : ``}
                    ${data?.archived ? `archived = ${data.archived ? 1 : 0},` : ``}
                    ${data?.notes ? `notes = '${data.notes}',` : ``}
                    created_at_epoch = :created_at_epoch,
                    current_version = :current_version
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                created_at_epoch: utils.convertToEpoch(new Date().toLocaleDateString()),
                current_version: version_id,
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });


            return Promise.resolve(version_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async updateProductStockWarehouses(product: Product, identifiers: { product_id: string, connected_account_id: string }): Promise<string> {

        try {

            let sql_query = '';
            for (const stock of product.product_stock)
                if (stock.rec_id)
                    if (stock.stock_quantity > 0)
                        sql_query = `
                            UPDATE
                                products_stock_warehouses
                            SET
                                stock_quantity = ${stock.stock_quantity},
                                warehouse_id = '${stock.warehouse_id}',
                                runway_id = '${stock.runway_id}',
                                column_id = '${stock.column_id}',
                                column_shelf_id = '${stock.column_shelf_id}'
                            WHERE
                                rec_id = '${stock.rec_id}' AND
                                product_id = :product_id AND
                                connected_account_id = :connected_account_id;
                        `;
                    else
                        sql_query += `
                            DELETE FROM
                                products_stock_warehouses
                            WHERE
                                rec_id = '${stock.rec_id}' AND
                                product_id = :product_id AND
                                connected_account_id = :connected_account_id;
                        `;
                else
                    sql_query = `
                        INSERT INTO
                            products_stock_warehouses
                        SET
                            rec_id = '${productsIDNumbersGenerator.getProductStockID()}',
                            product_id = :product_id,
                            connected_account_id = :connected_account_id,
                            warehouse_id = '${stock.warehouse_id}',
                            runway_id = '${stock.runway_id}',
                            column_id = '${stock.column_id}',
                            column_shelf_id = '${stock.column_shelf_id}',
                            stock_quantity = ${stock.stock_quantity};
                    `;



            const result = await mysql.query(sql_query, { product_id: identifiers.product_id, connected_account_id: identifiers.connected_account_id });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async insertUpdateToHistory(identifiers: { product_id: string, connected_account_id: string, version_id: string }, updateProduct: boolean): Promise<void> {

        try {

            const result = await mysql.query(`
                SELECT
                    version
                FROM
                    products_update_history
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
                ORDER BY
                    version__created_at DESC
                LIMIT 1
            `, {
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });

            if (result.rowsCount === 0)
                return Promise.reject(null);



            const version = `v${(Number((result.rows[0].version as string).replace(/^.{1}/g, '')) + 1).toString()}.0`;
            const updateResult = await mysql.query(`
                INSERT INTO
                    products_update_history
                SET
                    rec_id = :rec_id,
                    ${updateProduct ? `version = '${version}',` : ''}
                    product_id = :product_id,
                    headline = (SELECT headline FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    product_brand = (SELECT product_brand FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    categories_belongs = (SELECT categories_belongs FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    product_code = (SELECT product_code FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    product_model = (SELECT product_model FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    stock = (SELECT stock FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    supplied_price = (SELECT supplied_price FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    clear_price = (SELECT clear_price FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    fee_percent = (SELECT fee_percent FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    fees = (SELECT fees FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    discount_percent = (SELECT discount_percent FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    discount = (SELECT discount FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    product_description = (SELECT product_description FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    supplier = (SELECT supplier FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    current_status = (SELECT current_status FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    archived = (SELECT archived FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    notes = (SELECT notes FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    connected_account_id = :connected_account_id,
                    created_at_epoch = (SELECT created_at_epoch FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    created_at = (SELECT created_at FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id),
                    version__created_at_epoch = :version__created_at_epoch
            `, {
                rec_id: identifiers.version_id,
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
                version__created_at_epoch: utils.convertToEpoch(new Date().toLocaleDateString()),
            });




            let updateVersionResult: QueryResult;
            if (updateProduct)
                updateVersionResult = await mysql.query(`
                    UPDATE
                        products
                    SET
                        current_version = :version_id
                    WHERE
                        product_id = :product_id AND
                        connected_account_id = :connected_account_id
                `, {
                    version_id: identifiers.version_id,
                    product_id: identifiers.product_id,
                    connected_account_id: identifiers.connected_account_id,
                });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async createProductTransactions(transaction: ProductTransaction): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    products_transactions
                SET
                    ${transaction?.product_created_at ? `product_created_at = '${transaction.product_created_at}',` : ``}
                    ${transaction?.whole_product_update ? `whole_product_update = ${transaction?.whole_product_update ? 1 : 0},` : ``}
                    ${transaction?.product_update_categories ? `product_update_categories = ${transaction?.product_update_categories ? 1 : 0},` : ``}
                    ${transaction?.added_category ? `added_category = '${transaction.added_category}',` : ``}
                    ${transaction?.removed_category ? `removed_category = '${transaction.removed_category}',` : ``}
                    ${transaction?.product_update_images ? `product_update_images = ${transaction.product_update_images},` : ``}
                    ${transaction?.field_changed ? `field_changed = '${transaction.field_changed}',` : ``}
                    ${transaction?.value_before ? `value_before = '${transaction.value_before}',` : ``}
                    ${transaction?.value_after ? `value_after = '${transaction.value_after}',` : ``}
                    ${transaction?.quantity_sold ? `quantity_sold = ${transaction.quantity_sold},` : ``}
                    ${transaction?.quantity_added ? `quantity_added = ${transaction.quantity_added},` : ``}
                    ${transaction?.quantity_removed ? `quantity_removed = ${transaction.quantity_removed},` : ``}
                    ${transaction?.warehouse_id ? `warehouse_id = '${transaction.warehouse_id}',` : ``}
                    ${transaction?.runway_id ? `runway_id = '${transaction.runway_id}',` : ``}
                    ${transaction?.column_id ? `column_id = '${transaction.column_id}',` : ``}
                    ${transaction?.column_shelf_id ? `column_shelf_id = '${transaction.column_shelf_id}',` : ``}
                    ${transaction?.purchased_price ? `purchased_price = ${transaction.purchased_price},` : ``}
                    ${transaction?.status_changed ? `status_changed = ${transaction?.status_changed ? 1 : 0},` : ``}
                    ${transaction?.status_before ? `status_before = '${transaction.status_before}',` : ``}
                    ${transaction?.status_after ? `status_after = '${transaction.status_after}',` : ``}
                    product_id = :product_id,
                    connected_account_id = :connected_account_id,
                    updated_by = :updated_by
            `, transaction);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}









// product specification
class CreateProductSpecificationService {


    async addProductSpecificationCategories(
        categories: ProductSpecificationCategory[],
        params: {
            product_id: string,
            connected_account_id: string,
            product_version: string;
        }): Promise<ProductSpecificationCategory[]> {



        try {


            let query_string = '';

            for (let i = 0; i < categories.length; i++) {
                categories[i].id = productsIDNumbersGenerator.getNewSpecificationCategoryID();
                categories[i].connected_account_id = params.connected_account_id;
                categories[i].product_id = params.product_id;
                categories[i].product_version = params.product_version;

                query_string += `
                    INSERT INTO
                        products_specification_categories
                    SET
                        id = '${categories[i].id}',
                        category_name = '${categories[i].category_name}',
                        product_id = '${categories[i].product_id}',
                        connected_account_id = '${categories[i].connected_account_id}',
                        product_version = '${categories[i].product_version}';
                `;
            }




            const result = await mysql.query(query_string);



            categories = await this.addProductSpecificationFields(categories);


            return Promise.resolve(categories);


        } catch (error) {
            return Promise.reject(error);
        }

    }







    async addProductSpecificationFields(categories_fields: ProductSpecificationCategory[]): Promise<ProductSpecificationCategory[]> {

        try {


            let query_string = '';
            for (let i = 0; i < categories_fields.length; i++)
                for (let j = 0; j < categories_fields[i].fields.length; j++) {
                    categories_fields[i].fields[j].id = productsIDNumbersGenerator.getNewSpecificationFieldID();
                    categories_fields[i].fields[j].specification_category_id = categories_fields[i].id;
                    categories_fields[i].fields[j].product_id = categories_fields[i].product_id;
                    categories_fields[i].fields[j].connected_account_id = categories_fields[i].connected_account_id;
                    categories_fields[i].fields[j].product_version = categories_fields[i].product_version;

                    query_string += `
                        INSERT INTO
                            products_specification_fields
                        SET
                            id = '${categories_fields[i].fields[j].id}',
                            specification_field_name = '${categories_fields[i].fields[j].specification_field_name}',
                            specification_field_value = '${categories_fields[i].fields[j].specification_field_value}',
                            specification_category_id = '${categories_fields[i].fields[j].specification_category_id}',
                            product_id = '${categories_fields[i].fields[j].product_id}',
                            connected_account_id = '${categories_fields[i].fields[j].connected_account_id}',
                            product_version = '${categories_fields[i].fields[j].product_version}';
                    `;
                }



            const result = await mysql.query(query_string);


            return Promise.resolve(categories_fields);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






// product images
class CreateProductImagesRecordsService {


    async newImagesVersion(data:
        {
            product: Product,
            product_id: string,
            connected_account_id: string,
            version_id: string
        }): Promise<void> {


        try {


            let query_string = '';
            for (let i = 0; i < data.product.images.length; i++)
                query_string += `
                    INSERT INTO
                        product_images_storage
                    SET
                        id = '${productImagesIDNUmbersGeneratorService.getImageId()}',
                        url = '${data.product.images[i].url}',
                        main_image = ${data.product.images[i].main_image ? 1 : 0},
                        product_id = '${data.product_id}',
                        connected_account_id = '${data.connected_account_id}',
                        product_version = '${data.version_id}';
                `;


            const result = await mysql.query(query_string);


        } catch (error) {
            return Promise.reject(error);
        }


    }


}










const productsList = new ProductsList();
const productStockGetListService = new ProductStockGetListService();
const specificProductsList = new SpecificProductsList();
const addNewProduct = new AddNewProduct();
const checkProductService = new CheckProductService();
const updateProductDataService = new UpdateProductDataService();

const createProductSpecificationService = new CreateProductSpecificationService();

const createProductImagesRecordsService = new CreateProductImagesRecordsService();

export {
    productsList, specificProductsList, addNewProduct, checkProductService, updateProductDataService,
    createProductSpecificationService, createProductImagesRecordsService
};
