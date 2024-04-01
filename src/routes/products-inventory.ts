import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { mysql } from '../lib/connectors/mysql';
import { mailServer } from '../lib/connectors/mailServer';
import { specificProductsList } from '../lib/products.service';
import { productsInventoryIdGenerator } from '../lib/id_numbers_generators/products-inventory';
import {
    CompanyWarehouse, Product, ProductInventoryMainData, ProductInventoryProductData, ProductInventoryProductWarehouseData,
    ProductInventoryProductWarehouseRunwaysData, ProductInventoryProductWarehouseRunwaysColumnsData,
    ProductInventoryProductWarehouseRunwaysColumnsShelfData
} from '../models';
import { companyWarehousesGetList } from '../lib/company-warehouses.service';
import { getProductInventoryService, postProductInventoryService } from '../lib/product-inventory.service';
import { ProductsInventoryIssuedEmailTemplate } from '../lib/email-templates/mails/inventory-printed';




export class ProductsInventoryRoutes {


    public routes(server: Application) {




        // get all inventories
        server.route('/api/products/inventories')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        connected_account_id: string;
                        page: number;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        page: Number(req.query.page) || 1,
                    };


                    const product_inventories: ProductInventoryMainData[] = await getProductInventoryService.getList(params, req);


                    return res.status(200).send(product_inventories);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // get only specific data for inventories
        server.route('/api/products/inventories-specific-data')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        connected_account_id: string;
                        page: number;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        page: Number(req.query.page) || 1,
                    };

                    const product_inventories: ProductInventoryMainData[] = await getProductInventoryService.getList(params, req, true);


                    return res.status(200).send(product_inventories);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // get specific inventory
        server.route('/api/products/inventories/:inventory_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        inventory_id: string;
                        connected_account_id: string;
                    } = {
                        inventory_id: req.params.inventory_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const product_inventory: ProductInventoryMainData = await getProductInventoryService.getInventory(params, req);


                    return res.status(200).send(product_inventory);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // create new inventory
        server.route('/api/products/inventories/n/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                const params_metadata: {
                    user_data: {
                        user_id: string;
                        first_name: string;
                        last_name: string;
                    };
                    connected_account_id: string;
                    current_status: string;
                    page: number;
                    inventory_id: string;
                    descriptive_title: string;
                    send_email: boolean;
                } = {
                    user_data: {
                        user_id: req.session.user.user_id.toString(),
                        first_name: req.session.user.first_name.toString(),
                        last_name: req.session.user.last_name.toString(),
                    },
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    current_status: 'in_stock',
                    page: 1,
                    inventory_id: productsInventoryIdGenerator.getNewInventoryID(),
                    descriptive_title: req?.body?.descriptive_title?.toString() || 'Products inventory',
                    send_email: req?.query?.send_email ? Boolean(req.query.send_email) : false,
                };




                try {

                    const resolved_obj = await postProductInventoryService.createNewProductInventoryReport(params_metadata, req);

                    return res.status(200).send(resolved_obj);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }


            });



    }


}

