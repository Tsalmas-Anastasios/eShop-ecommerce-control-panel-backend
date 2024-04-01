import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import {
    Product, GraphQlSearchProductsParamsArgsSpecificList, GraphQlSearchProductsParamsArgsSpecificProduct,
    ProductStock
} from '../models';

import {
    productsList, specificProductsList, addNewProduct, checkProductService, updateProductDataService,
    createProductSpecificationService, createProductImagesRecordsService
} from '../lib/products.service';


export class ProductsRoutes {

    public routes(server: Application): void {


        // general products list
        server.route('/api/ecommerce/store/products/products')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let products_list: Product[];
                    if (req.session.user.using_bizyhive_cloud)
                        products_list = await productsList.getProducts({ connected_account_id: account_id }, req);


                    return res.status(200).send(products_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // specific products list
        server.route('/api/ecommerce/store/products/specific-products')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: GraphQlSearchProductsParamsArgsSpecificList = req.query;
                    params.connected_account_id = utils.findAccountIDFromSessionObject(req);

                    if (params?.page)
                        params.page = Number(params.page);



                    let products_list: Product[] = [];
                    if (req.session.user.using_bizyhive_cloud)
                        products_list = await specificProductsList.getProducts(params, req);



                    return res.status(200).send(products_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // display and edit a product
        server.route('/api/ecommerce/store/products/:product')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const product_id = req.params.product;
                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let product: Product = null;
                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);

                        product = await productsList.getProduct(product_id, account_id, req);
                    }


                    return res.status(200).send(product);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const product_id: string = req.params.product;
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const user_id: string = req.session.user.user_id.toString();

                    let new_version_id = '';
                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);



                        const previous_ver_product: Product = new Product(await productsList.getProduct(product_id, account_id, req));



                        const data: Product = req.body;
                        data.stock = new Product().calculateProductStock(data.product_stock);
                        new_version_id = await updateProductDataService.updateProduct(data, { product_id: product_id, connected_account_id: account_id });
                        if (data.specification)
                            data.specification = await createProductSpecificationService.addProductSpecificationCategories(data.specification, {
                                product_id: data.product_id,
                                connected_account_id: account_id,
                                product_version: new_version_id,
                            });



                        // update images collection
                        await createProductImagesRecordsService.newImagesVersion({
                            product: data,
                            product_id: product_id,
                            connected_account_id: account_id,
                            version_id: new_version_id
                        });


                        await updateProductDataService.insertUpdateToHistory({ product_id: product_id, connected_account_id: account_id, version_id: new_version_id }, true);
                        await updateProductDataService.createProductTransactions({
                            product_id: product_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            whole_product_update: true,
                        });




                        // update stock collection
                        await updateProductDataService.updateProductStockWarehouses(data, { product_id: product_id, connected_account_id: account_id });



                        // create transactions for the stock
                        let sql_transactions_query = '';
                        for (const stock of data.product_stock)
                            if (!stock.rec_id)
                                sql_transactions_query += `
                                    INSERT INTO
                                        products_transactions
                                    SET
                                        product_id = :product_id,
                                        connected_account_id = :connected_account_id,
                                        updated_by = :updated_by,
                                        quantity_added = ${stock.stock_quantity},
                                        warehouse_id = '${stock.warehouse_id}',
                                        runway_id = '${stock.runway_id}',
                                        column_id = '${stock.column_id}',
                                        column_shelf_id = '${stock.column_shelf_id}',
                                        purchased_price = ${data.supplied_price};
                                `;
                            else
                                for (const previous_stock of previous_ver_product.product_stock)
                                    if (stock.stock_quantity > previous_stock.stock_quantity)
                                        sql_transactions_query += `
                                            INSERT INTO
                                                products_transactions
                                            SET
                                                product_id = :product_id,
                                                connected_account_id = :connected_account_id,
                                                updated_by = :updated_by,
                                                quantity_added = ${stock.stock_quantity - previous_stock.stock_quantity},
                                                warehouse_id = '${stock.warehouse_id}',
                                                runway_id = '${stock.runway_id}',
                                                column_id = '${stock.column_id}',
                                                column_shelf_id = '${stock.column_shelf_id}',
                                                purchased_price = ${data.supplied_price};
                                        `;
                                    else if (stock.stock_quantity < previous_stock.stock_quantity)
                                        sql_transactions_query += `
                                            INSERT INTO
                                                products_transactions
                                            SET
                                                product_id = :product_id,
                                                connected_account_id = :connected_account_id,
                                                updated_by = :updated_by,
                                                quantity_removed = ${previous_stock.stock_quantity - stock.stock_quantity},
                                                warehouse_id = '${stock.warehouse_id}',
                                                runway_id = '${stock.runway_id}',
                                                column_id = '${stock.column_id}',
                                                column_shelf_id = '${stock.column_shelf_id}';
                                        `;



                        // const product_stock_undefined: ProductStock[] = [];
                        for (const previous_product_stock of previous_ver_product.product_stock) {

                            let flag = false;

                            for (const product_stock of data.product_stock)
                                if (product_stock.rec_id === previous_product_stock.rec_id) {
                                    flag = true;
                                    break;
                                }


                            // if (!flag)
                            // product_stock_undefined.push(previous_product_stock);


                            if (!flag)
                                sql_transactions_query += `
                                    DELETE FROM
                                        products_stock_warehouses
                                    WHERE
                                        rec_id = '${previous_product_stock.rec_id}' AND
                                        product_id = :product_id AND
                                        connected_account_id = :connected_account_id;


                                    INSERT INTO
                                        products_transactions
                                    SET
                                        product_id = :product_id,
                                        connected_account_id = :connected_account_id,
                                        updated_by = :updated_by,
                                        quantity_removed = ${previous_product_stock.stock_quantity - previous_product_stock.stock_quantity},
                                        warehouse_id = '${previous_product_stock.warehouse_id}',
                                        runway_id = '${previous_product_stock.runway_id}',
                                        column_id = '${previous_product_stock.column_id}',
                                        column_shelf_id = '${previous_product_stock.column_shelf_id}';
                                `;

                        }





                        const result = await mysql.query(sql_transactions_query, { product_id: product_id, connected_account_id: account_id, updated_by: user_id });

                    }

                    return res.status(200).send({ code: 200, type: 'product_updated', message: 'Product updated. New version of product just created', new_version_id: new_version_id });

                } catch (error) {
                    console.log(error);
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // add new product
        server.route('/api/ecommerce/store/products/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const data: Product = new Product(req.body);


                    if (!data?.headline || !data?.product_brand || !data?.categories_belongs || !data?.product_model
                        || !data?.product_description)
                        return utils.errorHandlingReturn({ code: 400, type: 'forbidden', message: 'Missing data!' }, res);



                    // add new product to the db
                    data.current_status = data?.current_status || 'in_stock';
                    data.stock = new Product().calculateProductStock(data.product_stock);
                    data.notes = data?.notes || null;
                    data.created_at_epoch = 0;
                    if (req.session.user.using_bizyhive_cloud) {
                        data.connected_account_id = utils.findAccountIDFromSessionObject(req);

                        const identifiers = await addNewProduct.addProduct(data);

                        if (data?.specification?.length > 0)
                            data.specification = await createProductSpecificationService.addProductSpecificationCategories(data.specification, {
                                product_id: identifiers.product_id,
                                connected_account_id: data.connected_account_id,
                                product_version: identifiers.version_id,
                            });
                        data.product_id = identifiers.product_id;
                        data.product_code = identifiers.product_code;


                        await addNewProduct.addProductToHistory(data, identifiers.version_id);
                        await updateProductDataService.createProductTransactions({
                            product_id: data.product_id,
                            connected_account_id: data.connected_account_id,
                            updated_by: user_id,
                            product_created_at: new Date()
                        });




                        await addNewProduct.addProductStock(data);


                        // create transactions
                        let sql_transactions_query = '';
                        for (const stock of data.product_stock)
                            sql_transactions_query += `
                                INSERT INTO
                                    products_transactions
                                SET
                                    product_id = :product_id,
                                    connected_account_id = :connected_account_id,
                                    updated_by = :updated_by,
                                    quantity_added = ${stock.stock_quantity},
                                    warehouse_id = '${stock.warehouse_id}',
                                    runway_id = '${stock.runway_id}',
                                    column_id = '${stock.column_id}',
                                    column_shelf_id = '${stock.column_shelf_id}',
                                    purchased_price = ${data.supplied_price};
                            `;

                        const result = await mysql.query(sql_transactions_query, { ...data, updated_by: user_id });

                    }




                    return res.status(200).send({
                        code: 200,
                        type: 'successful_adding',
                        message: 'Product addition made successfully!',
                        product_id: data.product_id,
                        product_code: data.product_code,
                        product_version: data.current_version,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });








        // update notes for a product
        server.route('/api/ecommerce/store/products/:product_id/notes/update')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const product_id: string = req.params.product_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const notes = req.body?.notes || null;

                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        const result = await mysql.query(`
                            UPDATE
                                products
                            SET
                                notes = ${notes === null ? 'NULL' : `'${notes}'`}
                            WHERE
                                product_id = :product_id AND
                                connected_account_id = :connected_account_id
                        `, {
                            product_id: product_id,
                            connected_account_id: account_id
                        });
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'product_notes_updated',
                        message: 'Product notes updated successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // update categories that a product belongs
        server.route('/api/ecommerce/store/:product_id/categories/update')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const product_id: string = req.params.product_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const categories = req.body?.categories || null;

                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        let result;
                        if (categories !== null) {
                            result = await mysql.query(`SELECT categories_belongs FROM products WHERE product_id = :product_id AND connected_account_id = :connected_account_id;`, { product_id: product_id, connected_account_id: account_id });


                            let difference_type: 'remove' | 'add' = null;
                            let difference_string: string;
                            if (result.rows[0].categories_belongs.toString().length > categories.toString().length) {
                                difference_type = 'remove';
                                difference_string = utils.findDifferencesString(categories.toString(), result.rows[0].categories_belongs.toString());
                            } else {
                                difference_type = 'add';
                                difference_string = utils.findDifferencesString(result.rows[0].categories_belongs.toString(), categories.toString());
                            }

                            const category_name_changed = difference_string.split(':')[1].toString().split('"')[1];


                            result = await mysql.query(`
                                UPDATE
                                    products
                                SET
                                    categories_belongs = ${categories === null ? 'NULL' : `'${categories}'`}
                                WHERE
                                    product_id = :product_id AND
                                    connected_account_id = :connected_account_id
                            `, {
                                product_id: product_id,
                                connected_account_id: account_id
                            });


                            await updateProductDataService.createProductTransactions({
                                product_id: product_id,
                                connected_account_id: account_id,
                                updated_by: user_id,
                                product_update_categories: true,
                                added_category: difference_type === 'add' ? category_name_changed : null,
                                removed_category: difference_type === 'remove' ? category_name_changed : null,
                            });

                        }
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'product_categories_updated',
                        message: 'Product categories updated successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });






        server.route('/api/ecommerce/store/products/:product_id/get-shared-product')
            .get(async (req: Request, res: Response) => {

                try {

                    const params: {
                        product_id: string;
                        connected_account_id: string;
                    } = {
                        product_id: req.params.product_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };



                    if (req.session.user.using_bizyhive_cloud) {

                        // check if the product exist
                        if (!await checkProductService.productExists(params))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);



                        if (!await checkProductService.productIsShared(params))
                            return utils.errorHandlingReturn({ code: 400, type: 'product_not_shared', message: 'This product is not shared' }, res);


                        const product = await productsList.getProduct(params.product_id, params.connected_account_id, req);

                        return res.status(200).send(product);

                    }

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });

    }

}

