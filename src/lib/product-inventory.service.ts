import { Request } from 'express';
import {
    CompanyWarehouse, Product, ProductInventoryMainData, ProductInventoryProductData, ProductInventoryProductWarehouseData,
    ProductInventoryProductWarehouseRunwaysColumnsData, ProductInventoryProductWarehouseRunwaysColumnsShelfData,
    ProductInventoryProductWarehouseRunwaysData, Account
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config, emailServer } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import { specificProductsList } from './products.service';
import { companyWarehousesGetList } from './company-warehouses.service';
import { mailServer } from './connectors/mailServer';
import { ProductsInventoryIssuedEmailTemplate } from './email-templates/mails/inventory-printed';




class GetProductInventoryService {




    async getList(params?: {
        inventory_id?: string,
        connected_account_id?: string,
        page?: number
    }, req?: Request, specific_data?: boolean): Promise<ProductInventoryMainData[]> {

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
                        productInventories${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            inventory_id
                            connected_account_id
                            descriptive_title
                            created_at
                            created_by__user_id
                            created_by__first_name
                            created_by__last_name

                            ${!specific_data ? `
                                products{

                                    rec_product_id
                                    inventory_id
                                    connected_account_id
                                    product_id
                                    product_headline
                                    product_brand
                                    product_model
                                    product_code
                                    inventory_product_stock

                                    warehouses{

                                        rec_id
                                        inventory_id
                                        connected_account_id
                                        rec_product_id
                                        warehouse_id
                                        warehouse_distinctive_title
                                        warehouse_code_name
                                        warehouse_total_stock

                                        runways{

                                            rec_id
                                            inventory_id
                                            connected_account_id
                                            rec_product_id
                                            rec_warehouse_id
                                            runway_id
                                            runway_name
                                            runway_code
                                            runway_total_stock

                                            columns{

                                                rec_id
                                                inventory_id
                                                connected_account_id
                                                rec_product_id
                                                rec_warehouse_id
                                                rec_runway_id
                                                column_id
                                                column_name
                                                column_code
                                                column_total_stock

                                                shelf{

                                                    rec_id
                                                    inventory_id
                                                    connected_account_id
                                                    rec_product_id
                                                    rec_warehouse_id
                                                    rec_runway_id
                                                    rec_column_id
                                                    shelf_id
                                                    shelf_code
                                                    shelf_total_stock

                                                }

                                            }

                                        }

                                    }

                                }
                            ` : ``}

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const product_inventories: ProductInventoryMainData[] = result.data.productInventories as ProductInventoryMainData[];


            return Promise.resolve(product_inventories);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getInventory(params: { inventory_id: string, connected_account_id: string }, req?: Request): Promise<ProductInventoryMainData> {

        try {

            const product_inventories: ProductInventoryMainData[] = await this.getList(params, req || null);

            if (product_inventories.length === 0)
                return Promise.resolve(null);


            return Promise.resolve(product_inventories[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }



}








class PostProductInventoryService {





    async createNewProductInventoryReport(
        params_metadata: {
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
        },
        req?: Request,
        account_obj?: Account,
    ): Promise<any> {




        let products_list: Product[] = [];
        let warehouses: CompanyWarehouse[] = [];
        try {



            const promises: {
                products_list: Promise<Product[]>;
                warehouses: Promise<CompanyWarehouse[]>;
                inventory_saving: Promise<void>;
            } = {

                products_list: new Promise(async (resolve, reject) => {

                    try {


                        let products_list: Product[] = [];
                        if (req?.session?.user?.using_bizyhive_cloud || account_obj?.using_bizyhive_cloud)
                            while (true) {
                                const tmp_products_list: Product[] = await specificProductsList.getProducts({
                                    connected_account_id: params_metadata.connected_account_id,
                                    page: params_metadata.page,
                                    current_status: params_metadata.current_status
                                }, req || null);

                                products_list = [...products_list, ...tmp_products_list];

                                // offset --> 100
                                if (tmp_products_list.length % 100 !== 0)
                                    break;


                                params_metadata.page++;

                            }

                        resolve(products_list);

                    } catch (error) {
                        reject(error);
                    }

                }),


                warehouses: new Promise(async (resolve, reject) => {

                    try {
                        const warehouses: CompanyWarehouse[] = await companyWarehousesGetList.getWarehouses({ connected_account_id: params_metadata.connected_account_id }, req || null);
                        resolve(warehouses);
                    } catch (error) {
                        reject(error);
                    }

                }),


                inventory_saving: new Promise(async (resolve, reject) => {

                    try {

                        const inventory_result = await mysql.query(`
                            INSERT INTO
                                product_inventory_overview
                            SET
                                inventory_id = :inventory_id,
                                connected_account_id = :connected_account_id,
                                descriptive_title = :descriptive_title,
                                created_by__user_id = :created_by__user_id,
                                created_by__first_name = :created_by__first_name,
                                created_by__last_name = :created_by__last_name
                        `, {
                            ...params_metadata,
                            created_by__user_id: params_metadata.user_data.user_id,
                            created_by__first_name: params_metadata.user_data.first_name,
                            created_by__last_name: params_metadata.user_data.last_name
                        });


                        resolve();

                    } catch (error) {
                        reject(error);
                    }

                })

            };

            const ex_promises = [];
            for (const promise in promises)
                ex_promises.push(promises[promise]);


            [products_list, warehouses] = await Promise.all(ex_promises);

        } catch (error) {
            return Promise.reject(error);
        }





        // create product
        const products_inventory: ProductInventoryProductData[] = [];
        for (const product of products_list) {

            const new_product: ProductInventoryProductData = new ProductInventoryProductData({
                rec_product_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                inventory_id: params_metadata.inventory_id,
                connected_account_id: params_metadata.connected_account_id,
                product_id: product.product_id,
                product_headline: product.headline,
                product_brand: product.product_brand,
                product_model: product.product_model,
                product_code: product.product_code,
                inventory_product_stock: product.stock,
            });



            for (const product_stock of product.product_stock) {


                let warehouse_flag = false;
                for (const warehouse of new_product.warehouses)
                    if (warehouse.warehouse_id === product_stock.warehouse_id) {
                        warehouse.warehouse_total_stock += product_stock.stock_quantity;


                        // runway
                        let runway_flag = false;
                        for (const runway of warehouse.runways)
                            if (runway.runway_id === product_stock.runway_id) {
                                runway.runway_total_stock += product_stock.stock_quantity;


                                // column
                                let column_flag = false;
                                for (const column of runway.columns)
                                    if (column.column_id === product_stock.column_id) {
                                        column.column_total_stock += product_stock.stock_quantity;


                                        // shelf
                                        let shelf_flag = false;
                                        for (const shelf of column.shelf)
                                            if (shelf.shelf_id === product_stock.column_shelf_id) {
                                                shelf.shelf_total_stock += product_stock.stock_quantity;
                                                shelf_flag = true;
                                                break;
                                            }



                                        if (!shelf_flag) {
                                            let new_shelf: ProductInventoryProductWarehouseRunwaysColumnsShelfData;

                                            for (const ew of warehouses)
                                                if (ew.warehouse_id === product_stock.warehouse_id) {
                                                    for (const er of ew.runways)
                                                        if (er.runway_id === product_stock.runway_id) {
                                                            for (const ec of er.columns)
                                                                if (ec.column_id === product_stock.column_id) {
                                                                    for (const shelf of ec.shelf)
                                                                        if (shelf.shelf_id === product_stock.column_shelf_id) {
                                                                            new_shelf = new ProductInventoryProductWarehouseRunwaysColumnsShelfData({
                                                                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                                                inventory_id: params_metadata.inventory_id,
                                                                                connected_account_id: params_metadata.connected_account_id,
                                                                                rec_product_id: new_product.rec_product_id,
                                                                                rec_warehouse_id: warehouse.rec_id,
                                                                                rec_runway_id: runway.rec_id,
                                                                                rec_column_id: column.rec_id,
                                                                                shelf_id: shelf.shelf_id,
                                                                                shelf_code: shelf.shelf_code,
                                                                                shelf_total_stock: product_stock.stock_quantity,
                                                                            });

                                                                            break;
                                                                        }

                                                                    break;
                                                                }

                                                            break;
                                                        }

                                                    break;
                                                }



                                            column.shelf.push(new_shelf);
                                        }






                                        column_flag = true;
                                        break;
                                    }



                                if (!column_flag) {
                                    let new_column: ProductInventoryProductWarehouseRunwaysColumnsData;

                                    for (const ew of warehouses)
                                        if (ew.warehouse_id === product_stock.warehouse_id) {
                                            for (const er of ew.runways)
                                                if (er.runway_id === product_stock.runway_id) {
                                                    for (const column of er.columns)
                                                        if (column.column_id === product_stock.column_id) {
                                                            new_column = new ProductInventoryProductWarehouseRunwaysColumnsData({
                                                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                                inventory_id: params_metadata.inventory_id,
                                                                connected_account_id: params_metadata.connected_account_id,
                                                                rec_product_id: new_product.rec_product_id,
                                                                rec_warehouse_id: warehouse.rec_id,
                                                                rec_runway_id: runway.rec_id,
                                                                column_id: column.column_id,
                                                                column_name: column.column_name,
                                                                column_code: column.column_code,
                                                                column_total_stock: product_stock.stock_quantity,
                                                            });



                                                            // shelf
                                                            for (const shelf of column.shelf)
                                                                if (shelf.shelf_id === product_stock.column_shelf_id) {
                                                                    const new_shelf: ProductInventoryProductWarehouseRunwaysColumnsShelfData = new ProductInventoryProductWarehouseRunwaysColumnsShelfData({
                                                                        rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                                        inventory_id: params_metadata.inventory_id,
                                                                        connected_account_id: params_metadata.connected_account_id,
                                                                        rec_product_id: new_product.rec_product_id,
                                                                        rec_warehouse_id: warehouse.rec_id,
                                                                        rec_runway_id: runway.rec_id,
                                                                        rec_column_id: new_column.rec_id,
                                                                        shelf_id: shelf.shelf_id,
                                                                        shelf_code: shelf.shelf_code,
                                                                        shelf_total_stock: product_stock.stock_quantity,
                                                                    });


                                                                    new_column.shelf.push(new_shelf);

                                                                    break;
                                                                }


                                                            break;
                                                        }

                                                    break;
                                                }

                                            break;
                                        }

                                    runway.columns.push(new_column);
                                }



                                runway_flag = true;
                                break;
                            }


                        // new runway
                        if (!runway_flag) {
                            let new_runway: ProductInventoryProductWarehouseRunwaysData;
                            for (const ew of warehouses)
                                if (ew.warehouse_id === product_stock.warehouse_id) {
                                    for (const runway of ew.runways)
                                        if (runway.runway_id === product_stock.runway_id) {
                                            new_runway = new ProductInventoryProductWarehouseRunwaysData({
                                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                inventory_id: params_metadata.inventory_id,
                                                connected_account_id: params_metadata.connected_account_id,
                                                rec_product_id: new_product.rec_product_id,
                                                rec_warehouse_id: warehouse.rec_id,
                                                runway_id: runway.runway_id,
                                                runway_name: runway.runway_name,
                                                runway_code: runway.runway_code,
                                                runway_total_stock: product_stock.stock_quantity,
                                            });


                                            for (const column of runway.columns)
                                                if (column.column_id === product_stock.column_id) {
                                                    const new_column = new ProductInventoryProductWarehouseRunwaysColumnsData({
                                                        rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                        inventory_id: params_metadata.inventory_id,
                                                        connected_account_id: params_metadata.connected_account_id,
                                                        rec_product_id: new_product.rec_product_id,
                                                        rec_warehouse_id: warehouse.rec_id,
                                                        rec_runway_id: new_runway.rec_id,
                                                        column_id: column.column_id,
                                                        column_name: column.column_name,
                                                        column_code: column.column_code,
                                                        column_total_stock: product_stock.stock_quantity,
                                                    });



                                                    // shelf
                                                    for (const shelf of column.shelf)
                                                        if (shelf.shelf_id === product_stock.column_shelf_id) {
                                                            const new_shelf: ProductInventoryProductWarehouseRunwaysColumnsShelfData = new ProductInventoryProductWarehouseRunwaysColumnsShelfData({
                                                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                                inventory_id: params_metadata.inventory_id,
                                                                connected_account_id: params_metadata.connected_account_id,
                                                                rec_product_id: new_product.rec_product_id,
                                                                rec_warehouse_id: warehouse.rec_id,
                                                                rec_runway_id: new_runway.rec_id,
                                                                rec_column_id: new_column.rec_id,
                                                                shelf_id: shelf.shelf_id,
                                                                shelf_code: shelf.shelf_code,
                                                                shelf_total_stock: product_stock.stock_quantity,
                                                            });


                                                            new_column.shelf.push(new_shelf);

                                                            break;
                                                        }


                                                    new_runway.columns.push(new_column);
                                                    break;
                                                }

                                            break;
                                        }

                                    break;
                                }

                            warehouse.runways.push(new_runway);
                        }


                        warehouse_flag = true;
                        break;
                    }




                if (!warehouse_flag) {
                    let new_warehouse: ProductInventoryProductWarehouseData;
                    for (const warehouse of warehouses)
                        if (warehouse.warehouse_id === product_stock.warehouse_id) {
                            new_warehouse = new ProductInventoryProductWarehouseData({
                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                inventory_id: params_metadata.inventory_id,
                                connected_account_id: params_metadata.connected_account_id,
                                rec_product_id: new_product.rec_product_id,
                                warehouse_id: warehouse.warehouse_id,
                                warehouse_distinctive_title: warehouse.distinctive_title,
                                warehouse_code_name: warehouse.code_name,
                                warehouse_total_stock: product_stock.stock_quantity,
                            });


                            // create runway
                            let new_runway: ProductInventoryProductWarehouseRunwaysData;
                            for (const runway of warehouse.runways)
                                if (runway.runway_id === product_stock.runway_id) {
                                    new_runway = new ProductInventoryProductWarehouseRunwaysData({
                                        rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                        inventory_id: params_metadata.inventory_id,
                                        connected_account_id: params_metadata.connected_account_id,
                                        rec_product_id: new_product.rec_product_id,
                                        rec_warehouse_id: new_warehouse.rec_id,
                                        runway_id: runway.runway_id,
                                        runway_name: runway.runway_name,
                                        runway_code: runway.runway_code,
                                        runway_total_stock: product_stock.stock_quantity,
                                    });


                                    for (const column of runway.columns)
                                        if (column.column_id === product_stock.column_id) {
                                            const new_column: ProductInventoryProductWarehouseRunwaysColumnsData = new ProductInventoryProductWarehouseRunwaysColumnsData({
                                                rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                inventory_id: params_metadata.inventory_id,
                                                connected_account_id: params_metadata.connected_account_id,
                                                rec_product_id: new_product.rec_product_id,
                                                rec_warehouse_id: new_warehouse.rec_id,
                                                rec_runway_id: new_runway.rec_id,
                                                column_id: column.column_id,
                                                column_name: column.column_name,
                                                column_code: column.column_code,
                                                column_total_stock: product_stock.stock_quantity,
                                            });



                                            for (const shelf of column.shelf)
                                                if (shelf.shelf_id === product_stock.column_shelf_id) {
                                                    const new_shelf: ProductInventoryProductWarehouseRunwaysColumnsShelfData = new ProductInventoryProductWarehouseRunwaysColumnsShelfData({
                                                        rec_id: utils.generateId(config.product_inventories_products_id_chars_length, config.nanoid_alphabet),
                                                        inventory_id: params_metadata.inventory_id,
                                                        connected_account_id: params_metadata.connected_account_id,
                                                        rec_product_id: new_product.rec_product_id,
                                                        rec_warehouse_id: new_warehouse.rec_id,
                                                        rec_runway_id: new_runway.rec_id,
                                                        rec_column_id: new_column.rec_id,
                                                        shelf_id: shelf.shelf_id,
                                                        shelf_code: shelf.shelf_code,
                                                        shelf_total_stock: product_stock.stock_quantity,
                                                    });


                                                    new_column.shelf.push(new_shelf);

                                                    break;
                                                }


                                            new_runway.columns.push(new_column);

                                            break;
                                        }


                                    break;
                                }


                            new_warehouse.runways.push(new_runway);
                            break;
                        }

                    new_product.warehouses.push(new_warehouse);
                }


            }



            products_inventory.push(new_product);

        }




        if (products_inventory.length <= 0)
            return Promise.resolve({
                code: 200,
                type: 'inventory_created',
                message: 'New products inventory created successfully!',
                inventory_data: {
                    inventory_id: params_metadata.inventory_id,
                    descriptive_title: params_metadata.descriptive_title,
                    inventory_products: products_inventory
                }
            });



        // insert products info only
        try {


            let sql_products_insertion = '';
            for (const product of products_inventory)
                sql_products_insertion += `
                    INSERT INTO
                        product_inventories_products
                    SET
                        rec_product_id = '${product.rec_product_id}',
                        inventory_id = :inventory_id,
                        connected_account_id = :connected_account_id,
                        product_id = '${product.product_id}',
                        product_headline = '${product.product_headline}',
                        product_brand = '${product.product_brand}',
                        product_model = '${product.product_model}',
                        product_code = '${product.product_code}',
                        inventory_product_stock = '${product.inventory_product_stock}';
                `;



            const products_result = await mysql.query(sql_products_insertion, { inventory_id: params_metadata.inventory_id, connected_account_id: params_metadata.connected_account_id });

        } catch (error) {
            return Promise.reject(error);
        }





        // insert the product analysis
        //      1. make tha sql strings
        //      2. execute them

        const sql_strings: {
            warehouses: string;
            runways: string;
            columns: string;
            shelf: string;
        } = {
            warehouses: '',
            runways: '',
            columns: '',
            shelf: '',
        };


        for (const product of products_inventory)
            for (const warehouse of product.warehouses) {

                sql_strings.warehouses += `
                            INSERT INTO
                                product_inventories_products_warehouses
                            SET
                                rec_id = '${warehouse.rec_id}',
                                inventory_id = '${warehouse.inventory_id}',
                                connected_account_id = '${warehouse.connected_account_id}',
                                rec_product_id = '${warehouse.rec_product_id}',
                                warehouse_id = '${warehouse.warehouse_id}',
                                warehouse_distinctive_title = '${warehouse.warehouse_distinctive_title}',
                                warehouse_code_name = '${warehouse.warehouse_code_name}',
                                warehouse_total_stock = ${warehouse.warehouse_total_stock};
                        `;



                for (const runway of warehouse.runways) {

                    sql_strings.runways += `
                                INSERT INTO
                                    product_inventories_products_warehouses_runways
                                SET
                                    rec_id = '${runway.rec_id}',
                                    inventory_id = '${runway.inventory_id}',
                                    connected_account_id = '${runway.connected_account_id}',
                                    rec_product_id = '${runway.rec_product_id}',
                                    rec_warehouse_id = '${runway.rec_warehouse_id}',
                                    runway_id = '${runway.runway_id}',
                                    runway_name = '${runway.runway_name}',
                                    runway_code = '${runway.runway_code}',
                                    runway_total_stock = ${runway.runway_total_stock};
                            `;



                    for (const column of runway.columns) {

                        sql_strings.columns += `
                                    INSERT INTO
                                        product_inventories_products_warehouses_columns
                                    SET
                                        rec_id = '${column.rec_id}',
                                        inventory_id = '${column.inventory_id}',
                                        connected_account_id = '${column.connected_account_id}',
                                        rec_product_id = '${column.rec_product_id}',
                                        rec_warehouse_id = '${column.rec_warehouse_id}',
                                        rec_runway_id = '${column.rec_runway_id}',
                                        column_id = '${column.column_id}',
                                        column_name = '${column.column_name}',
                                        column_code = '${column.column_code}',
                                        column_total_stock = ${column.column_total_stock};
                                `;



                        for (const shelf of column.shelf)
                            sql_strings.shelf += `
                                        INSERT INTO
                                            product_inventories_products_warehouses_columns_shelf
                                        SET
                                            rec_id = '${shelf.rec_id}',
                                            inventory_id = '${shelf.inventory_id}',
                                            connected_account_Id = '${shelf.connected_account_id}',
                                            rec_product_id = '${shelf.rec_product_id}',
                                            rec_warehouse_id = '${shelf.rec_warehouse_id}',
                                            rec_runway_id = '${shelf.rec_runway_id}',
                                            rec_column_id = '${shelf.rec_column_id}',
                                            shelf_id = '${shelf.shelf_id}',
                                            shelf_code = '${shelf.shelf_code}',
                                            shelf_total_stock = ${shelf.shelf_total_stock};
                                    `;

                    }

                }

            }




        // insert into db
        try {

            const products_warehouses_analysis_result = await mysql.query(`
                ${sql_strings.warehouses}
                ${sql_strings.runways}
                ${sql_strings.columns}
                ${sql_strings.shelf}
            `);

        } catch (error) {
            return Promise.reject(error);
        }




        // send email here - if requested
        if (params_metadata.send_email) {

            // find account's email
            let account_email: string;
            if (!req?.session?.user?.is_account)
                try {

                    const account_email_result = await mysql.query(`SELECT email FROM accounts WHERE id = :id`, { id: params_metadata.connected_account_id });
                    account_email = account_email_result[0].email.toString();

                } catch (error) {
                    return Promise.reject(error);
                }
            else
                account_email = req?.session?.user?.email || account_obj?.email?.toString();




            // send the email here
            try {

                const recipient_emails: string[] = [account_email];
                if (!req?.session?.user?.is_account)
                    recipient_emails.push(req.session.user.email);



                const email_id = await mailServer.send_mail({
                    from_name: emailServer.info_email.defaults.name,
                    from_email: emailServer.info_email.defaults.email,
                    from_psswd: emailServer.info_email.auth.password,
                    to: recipient_emails,
                    subject: 'New products inventory issued!',
                    html: new ProductsInventoryIssuedEmailTemplate().html,
                });

            } catch (error) {
                return Promise.reject(error);
            }

        }





        return Promise.resolve({
            code: 200,
            type: 'inventory_created',
            message: 'New products inventory created successfully!',
            inventory_data: {
                inventory_id: params_metadata.inventory_id,
                descriptive_title: params_metadata.descriptive_title,
                inventory_products: products_inventory
            }
        });


    }





}





const getProductInventoryService = new GetProductInventoryService();
const postProductInventoryService = new PostProductInventoryService();
export { getProductInventoryService, postProductInventoryService };
