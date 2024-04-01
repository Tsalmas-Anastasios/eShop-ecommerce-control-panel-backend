import { Application, Request, Response, request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, Company
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';

import {
    companyWarehousesGetList, companyWarehousePutUpdateService, companyWarehouseCheckerService,
    companyWarehouseDeleteService, companyWarehousePostAddService
} from '../lib/company-warehouses.service';
import { companyWarehousesIDNumbersGenerator } from '../lib/id_numbers_generators/company-warehouse';





export class CompanyWarehouseRoutes {


    public routes(server: Application) {


        // warehouses list
        server.route('/api/settings/company-data/warehouses')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    const warehouses: CompanyWarehouse[] = await companyWarehousesGetList.getWarehouses({ connected_account_id: account_id }, req);

                    return res.status(200).send(warehouses);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // specific warehouse data (get, put, delete)
        server.route('/api/settings/company-data/warehouses/:warehouse_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        connected_account_id: string;
                        warehouse_id: string;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                    };



                    if (!await companyWarehouseCheckerService.warehouseExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'warehouse_not_found', message: 'Warehouse doesn\'t found' }, res);


                    const warehouse: CompanyWarehouse = await companyWarehousesGetList.getWarehouse(params, req);

                    return res.status(200).send(warehouse);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    // update only the basic data for the warehouse
                    const params: {
                        connected_account_id: string;
                        warehouse_id: string;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                    };


                    const warehouse: CompanyWarehouse = req.body.warehouse;
                    warehouse.warehouse_id = params.warehouse_id;
                    warehouse.connected_account_id = params.connected_account_id;


                    for (const prop in warehouse)
                        if (prop !== 'warehouse_manager__phone2' && (!warehouse[prop] || warehouse[prop] === null))
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be updated' }, res);



                    if (!await companyWarehouseCheckerService.warehouseExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'warehouse_not_found', message: 'Warehouse doesn\'t found' }, res);


                    await companyWarehousePutUpdateService.updateWarehouseBasicData(params, warehouse);


                    return res.status(200).send({ code: 200, type: 'warehouse_data_updated', message: 'Warehouse data updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    if (!await companyWarehouseCheckerService.warehouseExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'warehouse_not_found', message: 'Warehouse doesn\'t found' }, res);


                    await companyWarehouseDeleteService.deleteWarehouse(params);


                    return res.status(200).send({ code: 200, type: 'warehouse_deleted', message: 'Warehouse deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // add new warehouse
        server.route('/api/settings/company-data/warehouses/w/add')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);

                    const warehouse: CompanyWarehouse = req.body.warehouse;
                    warehouse.connected_account_id = connected_account_id;
                    warehouse.warehouse_id = companyWarehousesIDNumbersGenerator.getWarehouseID();


                    // check if the required data exist
                    for (const prop in warehouse)
                        if (prop !== 'warehouse_manager__phone2'
                            && ((typeof warehouse[prop] === 'string' && (!warehouse[prop] || warehouse[prop] === null))
                                || (typeof warehouse[prop] === 'number' && warehouse[prop] === null)))
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be updated' }, res);



                    // check if the data for runways exist
                    for (const runway of warehouse.runways)
                        if (!runway?.runway_code || !runway?.runway_name)
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to save successfully the runways' }, res);
                        else {
                            runway.runway_id = companyWarehousesIDNumbersGenerator.getRunwayID();

                            // check for its columns
                            for (const column of runway.columns)
                                if (!column?.column_code || !column?.column_name)
                                    return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to save successfully the columns' }, res);
                                else {
                                    column.column_id = companyWarehousesIDNumbersGenerator.getColumnID();

                                    for (const shelf of column.shelf)
                                        if (!shelf.shelf_code)
                                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to save successfully the shelf of columns' }, res);
                                        else {
                                            shelf.shelf_id = companyWarehousesIDNumbersGenerator.getShelfID();
                                            shelf.warehouse_id = warehouse.warehouse_id;
                                            shelf.connected_account_id = connected_account_id;
                                            shelf.runway_id = runway.runway_id;
                                            shelf.column_id = column.column_id;
                                        }

                                    column.warehouse_id = warehouse.warehouse_id;
                                    column.connected_account_id = connected_account_id;
                                    column.runway_id = runway.runway_id;
                                }

                            runway.warehouse_id = warehouse.warehouse_id;
                            runway.connected_account_id = connected_account_id;
                        }



                    // add warehouse's data to the db
                    await companyWarehousePostAddService.addNewWarehouse(warehouse);

                    await Promise.all([
                        companyWarehousePostAddService.addRunways(warehouse.runways),
                        companyWarehousePostAddService.addColumns(warehouse.runways),
                        companyWarehousePostAddService.addColumnsShelf(warehouse.runways),
                    ]);



                    return res.status(200).send({ code: 200, type: 'warehouse_saved', message: 'Warehouse saved successfully', warehouse_id: warehouse.warehouse_id });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }


}
