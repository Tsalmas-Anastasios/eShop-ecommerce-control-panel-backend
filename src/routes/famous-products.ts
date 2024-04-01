import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { Product, GraphQlSearchProductsParamsArgsSpecificList, GraphQlSearchProductsParamsArgsSpecificProduct } from '../models';

import {
    famousProductsGetListID, famousProductsGetListProduct, famousProductsCategoriesListIDName
} from '../lib/famous-products.service';

import { createdAtCreationStringService } from '../scheduled-tasks/services/created_at-creation.service';






export class FamousProductsRoutes {


    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/famous/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const type = req?.query?.type?.toString() || 'monthly';
                    const date = utils.moment(new Date()).format('YYYY/MM/DD');
                    if (type !== 'general' && type !== 'yearly' && type !== 'monthly' && type !== 'weekly')
                        return utils.errorHandlingReturn({ code: 400, tpe: 'forbidden', message: 'Wrong type value!' }, res);



                    let products_list: Product[];
                    if (req.session.user.using_bizyhive_cloud) {
                        const product_ids = await famousProductsGetListID.getProductsIDDate({ type: type, date: date, connected_account_id: connected_account_id });
                        products_list = await famousProductsGetListProduct.getProducts({
                            products: product_ids,
                            connected_account_id: connected_account_id
                        }, req);
                    }



                    return res.status(200).send(products_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors }, res);
                }

            });





        // server.route('/api/ecommerce/store/products/famous/date-range-list')
        //     .get(utils.checkAuth, async (req: Request, res: Response) => {

        //         try {


        //             const params = {
        //                 length: Number(req.query?.length) || 10,
        //                 date: req.query?.date.toString() || new Date().toLocaleTimeString(),
        //                 type: req.query?.type.toString() || 'general',
        //                 connected_account_id: utils.findAccountIDFromSessionObject(req),
        //             };
        //             if (params.length > 30)
        //                 params.length = 30;

        //             if (!config.cron_jobs_types.includes(params.type))
        //                 return res.status(400).send({ code: 400, type: 'forbidden', message: 'Wrong type value. See the documentation and try again' });



        //             let products_list: Product[];
        //             if (req.session.user.using_bizyhive_cloud) {
        //                 const product_ids = await famousProductsGetListID.getProductsIDAllTypes(params);
        //                 products_list = await famousProductsGetListProduct.getProducts({
        //                     products: product_ids,
        //                     date: params.date,
        //                     type: params.type,
        //                     length: params.length,
        //                     connected_account_id: params.connected_account_id
        //                 }, req);
        //             }


        //             return res.status(200).send(products_list);

        //         } catch (error) {
        //             return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors }, res);
        //         }

        //     });





        // by category
        server.route('/api/ecommerce/store/products/famous/list-category')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const type = req?.query?.type?.toString() || 'monthly';
                    const date = utils.moment(new Date()).format('YYYY/MM/DD');
                    if (type !== 'general' && type !== 'yearly' && type !== 'monthly' && type !== 'weekly')
                        return utils.errorHandlingReturn({ code: 400, tpe: 'forbidden', message: 'Wrong type value!' }, res);



                    const products_list: {
                        product_category_id: string;
                        product_category_label: string;
                        products: Product[]
                    }[] = [];


                    if (req.session.user.using_bizyhive_cloud) {

                        // get the categories
                        const categories_result = await mysql.query(`SELECT pcategory_id, label FROM product_categories WHERE connected_account_id = :connected_account_id`, { connected_account_id: connected_account_id });
                        if (categories_result.rowsCount === 0)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'no_categories_found',
                                message: 'No categories found'
                            }, res);


                        const product_categories: {
                            category_id: string;
                            category_label: string;
                        }[] = [];
                        for (let i = 0; i < categories_result.rowsCount; i++)
                            product_categories.push({
                                category_id: categories_result.rows[i].pcategory_id,
                                category_label: categories_result.rows[i].label,
                            });



                        // products array
                        for (const category of product_categories) {
                            const result = await mysql.query(`
                                SELECT
                                    DISTINCT product_id
                                FROM
                                    famous_products_per_category
                                WHERE
                                    connected_account_id = :connected_account_id AND
                                    ${createdAtCreationStringService.createString({ range: type, date: date, table_field: 'created_at' })} AND
                                    products_category_id = :products_category_id AND
                                    type = :type
                                ORDER BY
                                    created_at DESC,
                                    row_number;
                            `, {
                                connected_account_id: connected_account_id,
                                products_category_id: category.category_id,
                                type: type
                            });




                            if (result.rowsCount === 0)
                                continue;


                            const products_id: string[] = [];
                            for (let i = 0; i < result.rowsCount; i++)
                                products_id.push(result.rows[i].product_id.toString());



                            const products = await famousProductsGetListProduct.getProducts({
                                products: products_id,
                                connected_account_id: connected_account_id
                            }, req);




                            products_list.push({
                                product_category_id: category.category_id,
                                product_category_label: category.category_label,
                                products: products,
                            });

                        }
                    }


                    return res.status(200).send(products_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors }, res);
                }

            });

    }


}
