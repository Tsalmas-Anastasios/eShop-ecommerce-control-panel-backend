import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { mysql } from '../lib/connectors/mysql';
import { ProductsInventoriesSettings, ProductInventoriesSettingsAutoGenerationTimeline } from '../models';
import { getProductInventoriesSettingsService } from '../lib/product-inventory-settings.service';




export class ProductsInventorySettingsRoutes {


    public routes(server: Application) {


        server.route('/api/products/inventories/s/settings')
            .get(async (req: Request, res: Response) => {


                try {

                    const settings: ProductsInventoriesSettings = await getProductInventoriesSettingsService.getSettings(utils.findAccountIDFromSessionObject(req), ['auto_generation_timeline'], req);

                    return res.status(200).send(settings || null);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }


            });





        // put settings - auto generate inventories scheduling
        server.route('/api/products/inventories/settings/auto-generate-scheduling')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                /*

                    body data:
                        { setting_data: ProductInventoriesSettingsAutoGenerationTimeline }

                */

                const setting_data: ProductInventoriesSettingsAutoGenerationTimeline = new ProductInventoriesSettingsAutoGenerationTimeline(req.body.setting_data);


                if (!setting_data?.setting_id && setting_data?.type) {
                    // post

                    setting_data.meta = JSON.stringify({ created_at: new Date() });
                    setting_data.connected_account_id = utils.findAccountIDFromSessionObject(req);
                    // setting_data.type = 'auto_generation_timeline';

                    try {

                        const response = await mysql.query(`
                            INSERT INTO
                                product_inventories_settings
                            SET
                                connected_account_id = :connected_account_id,
                                type = :type,
                                ${setting_data?.value ? `value = '${setting_data.value}',` : ``}
                                ${setting_data?.setting_auto_generate_date__day ? `setting_auto_generate_date__day = '${setting_data.setting_auto_generate_date__day}',` : ``}
                                ${setting_data?.setting_auto_generate_date__month ? `setting_auto_generate_date__month = '${setting_data.setting_auto_generate_date__month}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency ? `setting_auto_generate_date_frequency = '${setting_data.setting_auto_generate_date_frequency}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency__day ? `setting_auto_generate_date_frequency__day = '${setting_data.setting_auto_generate_date_frequency__day}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency__month ? `setting_auto_generate_date_frequency__month = '${setting_data.setting_auto_generate_date_frequency__month}',` : ``}
                                meta = :meta;
                        `, setting_data);



                        setting_data.setting_id = response.rows.insertId;

                        return res.status(200).send({
                            code: 200,
                            type: 'setting_inserted',
                            updated_object: setting_data,
                        });

                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }

                } else if (setting_data?.type && setting_data?.setting_id) {
                    // put

                    setting_data.meta = {
                        ...setting_data.meta,
                        updated_at: new Date()
                    };
                    setting_data.meta = JSON.stringify(setting_data.meta);
                    setting_data.connected_account_id = utils.findAccountIDFromSessionObject(req);


                    try {

                        const response = await mysql.query(`
                            UPDATE
                                product_inventories_settings
                            SET
                                ${setting_data?.value ? `value = '${setting_data.value}',` : ``}
                                ${setting_data?.setting_auto_generate_date__day ? `setting_auto_generate_date__day = '${setting_data.setting_auto_generate_date__day}',` : ``}
                                ${setting_data?.setting_auto_generate_date__month ? `setting_auto_generate_date__month = '${setting_data.setting_auto_generate_date__month}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency ? `setting_auto_generate_date_frequency = '${setting_data.setting_auto_generate_date_frequency}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency__day ? `setting_auto_generate_date_frequency__day = '${setting_data.setting_auto_generate_date_frequency__day}',` : ``}
                                ${setting_data?.setting_auto_generate_date_frequency__month ? `setting_auto_generate_date_frequency__month = '${setting_data.setting_auto_generate_date_frequency__month}',` : ``}
                                meta = :meta
                            WHERE
                                setting_id = :setting_id AND
                                connected_account_id = :connected_account_id;
                        `, setting_data);



                        return res.status(201).send({
                            code: 201,
                            type: 'setting_updated',
                            updated_object: setting_data
                        });

                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }

                } else if (!setting_data?.type)
                    // delete
                    try {

                        setting_data.connected_account_id = utils.findAccountIDFromSessionObject(req);
                        const response = await mysql.query(`DELETE FROM product_inventories_settings WHERE setting_id = :setting_id AND connected_account_id = :connected_account_id;`, setting_data);


                        return res.status(202).send({ code: 202, type: 'setting_deleted', message: 'setting deleted successfully' });

                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }

            });


    }


}
