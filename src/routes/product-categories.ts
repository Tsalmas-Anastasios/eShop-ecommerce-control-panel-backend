import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { ProductCategory } from '../models';
import {
    productCategoryListService, productCategoryAddService, checkProductCategoryService, updateProductCategoryService
} from '../lib/product-categories.service';




export class ProductCategoriesRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/categories/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);


                    let product_categories: ProductCategory[];
                    if (req.session.user.using_bizyhive_cloud)
                        product_categories = await productCategoryListService.getList({ connected_account_id: account_id });



                    return res.status(200).send(product_categories);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        // add new category
        server.route('/api/ecommerce/store/products/categories/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.body?.label)
                        return utils.errorHandlingReturn({ code: 401, type: 'missing_credentials', message: 'Missing label value' }, res);


                    const label = req.body.label;
                    const account_id = utils.findAccountIDFromSessionObject(req);


                    if (req.session.user.using_bizyhive_cloud) {
                        // check if category already exists
                        const result = await mysql.query(`
                            SELECT
                                pcategory_id
                            FROM
                                product_categories
                            WHERE
                                label = :label AND
                                connected_account_id = :connected_account_id
                        `, {
                            label: label,
                            connected_account_id: account_id
                        });


                        if (result.rowsCount > 0)
                            return utils.errorHandlingReturn({ code: 400, type: 'product_category_already_exists', message: 'This label of product category is already exist' }, res);


                        await productCategoryAddService.addNewCategory({ label: label, connected_account_id: account_id });
                    }


                    return res.status(200).send({ code: 200, type: 'product_category_connected', message: 'Product category added successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // display specific category, edit a category
        server.route('/api/ecommerce/store/products/c/categories/:pcategory_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const pcategory_id = req.params.pcategory_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);

                    let product_category: ProductCategory;
                    if (req.session.user.using_bizyhive_cloud)
                        product_category = await productCategoryListService.getSpecificCategory({ pcategory_id: pcategory_id, connected_account_id: account_id });


                    return res.status(200).send(product_category);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const pcategory_id = req.params.pcategory_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const label = req.body?.label || null;


                    if (req.session.user.using_bizyhive_cloud) {

                        if (!await checkProductCategoryService.productCategoryExists({ pcategory_id: pcategory_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_category_not_found', message: 'Product category not found for this account' }, res);




                        // check if the 'new label' is already exists
                        let result = await mysql.query(`
                            SELECT
                                pcategory_id
                            FROM
                                product_categories
                            WHERE
                                label = :label AND
                                connected_account_id = :connected_account_id
                        `, {
                            label: label,
                            connected_account_id: account_id
                        });


                        if (result.rowsCount > 0)
                            return utils.errorHandlingReturn({ code: 400, type: 'product_category_already_exists', message: 'This label of product category is already exist' }, res);



                        // take the previous label's version
                        result = await mysql.query(`
                            SELECT
                                label
                            FROM
                                product_categories
                            WHERE
                                pcategory_id = :pcategory_id AND
                                connected_account_id = :connected_account_id
                        `, {
                            pcategory_id: pcategory_id,
                            connected_account_id: account_id
                        });


                        const previous_category_obj_property = `"${pcategory_id}":"${result.rows[0].label.toString()}"`;
                        const next_category_obj_property = `"${pcategory_id}":"${label}"`;


                        // update label
                        await updateProductCategoryService.updateProductCategory({ pcategory_id: pcategory_id, label: label, connected_account_id: account_id });



                        // update the labels in the products
                        result = await mysql.query(`
                            UPDATE
                                products
                            SET
                                categories_belongs = REPLACE(categories_belongs, '${previous_category_obj_property}', '${next_category_obj_property}')
                        `);

                    }



                    return res.status(200).send({ code: 200, type: 'product_category_updated', message: 'Product category updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const pcategory_id = req.params.pcategory_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);


                    if (req.session.user.using_bizyhive_cloud) {

                        if (!await checkProductCategoryService.productCategoryExists({ pcategory_id: pcategory_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_category_not_found', message: 'Product category not found for this account' }, res);




                        // take the label from category
                        const result = await mysql.query(`
                            SELECT
                                label
                            FROM
                                product_categories
                            WHERE
                                pcategory_id = :pcategory_id AND
                                connected_account_id = :connected_account_id
                        `, {
                            pcategory_id: pcategory_id,
                            connected_account_id: account_id
                        });


                        const category_label: string = result.rows[0].label.toString();



                        const product_category_record = `"${pcategory_id}":"${category_label}"`;


                        let replace_products = await mysql.query(`
                            UPDATE
                                products
                            SET
                                categories_belongs = REPLACE(categories_belongs, '${product_category_record}', '');
                        `);

                        replace_products = await mysql.query(`
                            UPDATE
                                products
                            SET
                                categories_belongs = REPLACE(categories_belongs, ',,', ',');
                        `);




                        const delete_category = await mysql.query(`
                            DELETE FROM
                                product_categories
                            WHERE
                                pcategory_id = :pcategory_id AND
                                connected_account_id = :connected_account_id
                        `, {
                            pcategory_id: pcategory_id,
                            connected_account_id: account_id,
                        });

                    }





                    return res.status(200).send({ code: 200, type: 'product_category_deleted', message: 'Product category deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }


}
