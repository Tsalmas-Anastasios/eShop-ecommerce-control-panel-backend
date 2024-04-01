import { Application, Request, Response, request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, Company
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';

import { companyWarehousesColumnsGetListService, companyWarehousesColumnsCheckerService } from '../lib/company-warehouses-columns.service';
import { companyWarehouseRunwaysCheckerService } from '../lib/company-warehouses-runways.service';
import { companyWarehousesIDNumbersGenerator } from '../lib/id_numbers_generators/company-warehouse';





export class CompanyWarehouseColumnsRoutes {


    public routes(server: Application) {


        // list of columns
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        runway_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const columns = await companyWarehousesColumnsGetListService.getColumns(params, req);


                    return res.status(200).send(columns);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // specific column
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns/:column_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const column: CompanyWarehouseColumn = await companyWarehousesColumnsGetListService.getSpecificColumn(params, req);


                    return res.status(200).send(column);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    const column: CompanyWarehouseColumn = req.body.column;

                    if (!await companyWarehousesColumnsCheckerService.columnExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'column_not_found', message: 'Column is not found to be updated' }, res);


                    if (!column?.column_name || !column?.column_code)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be updated' }, res);



                    const result = await mysql.query(`
                        UPDATE
                            company_warehouses__columns
                        SET
                            ${column?.column_name ? `column_name = '${column.column_name}',` : ``}
                            ${column?.column_code ? `column_code = '${column.column_code}',` : ``}
                            column_id = :column_id
                        WHERE
                            column_id = :column_id AND
                            runway_id = :runway_id AND
                            warehouse_id = :warehouse_id AND
                            connected_account_id = :connected_account_id
                    `, params);


                    return res.status(200).send({ code: 200, type: 'column_updated', message: 'Column updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    if (!await companyWarehousesColumnsCheckerService.columnExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'column_not_found', message: 'Column is not found to be updated' }, res);



                    const result = await mysql.query(`
                        DELETE FROM
                            company_warehouses__columns
                        WHERE
                            column_id = :column_id AND
                            runway_id = :runway_id AND
                            warehouse_id = :warehouse_id AND
                            connected_account_id = :connected_account_id
                    `, params);



                    return res.status(200).send({ code: 200, type: 'column_deleted', message: 'Column deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns/c/new')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        warehouse_id: string;
                        runway_id: string;
                        connected_account_id: string;
                    } = {
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };


                    let column: CompanyWarehouseColumn = req.body.column;

                    if (!column?.column_name || !column?.column_code)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to add new column' }, res);

                    if (!await companyWarehouseRunwaysCheckerService.runwayExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'runway_not_found', message: 'Runway did not found' }, res);



                    column = {
                        column_id: companyWarehousesIDNumbersGenerator.getColumnID(),
                        ...column,
                        ...params
                    };


                    const result = await mysql.query(`
                        INSERT INTO
                            company_warehouses__columns
                        SET
                            column_id = :column_id,
                            connected_account_id = :connected_account_id,
                            warehouse_id = :warehouse_id,
                            runway_id = :runway_id,
                            column_name = :column_name,
                            column_code = :column_code
                    `, params);


                    return res.status(200).send({ code: 200, type: 'column_saved', message: 'Column saved successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }


}
