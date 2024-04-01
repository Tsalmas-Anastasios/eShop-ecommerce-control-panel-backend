import { Application, Request, Response, request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, Company
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';

import { companyWarehouseRunwaysGetList, companyWarehouseRunwaysCheckerService } from '../lib/company-warehouses-runways.service';
import { companyWarehouseCheckerService } from '../lib/company-warehouses.service';
import { companyWarehousesIDNumbersGenerator } from '../lib/id_numbers_generators/company-warehouse';





export class CompanyWarehouseRunwaysRoutes {


    public routes(server: Application) {


        // all runways
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        connected_account_id: string;
                        warehouse_id: string;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                    };


                    const runways: CompanyWarehouseRunway[] = await companyWarehouseRunwaysGetList.getRunways(params, req);


                    return res.status(200).send(runways);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        // specific runway
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        runway_id: string;
                        connected_account_id: string;
                        warehouse_id: string;
                    } = {
                        runway_id: req.params.runway_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                    };


                    const runway = await companyWarehouseRunwaysGetList.getSpecificRunway(params, req);


                    return res.status(200).send(runway);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {


                const params: {
                    runway_id: string;
                    connected_account_id: string;
                    warehouse_id: string;
                    update_only_runway: boolean;
                } = {
                    runway_id: req.params.runway_id.toString(),
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    warehouse_id: req.params.warehouse_id.toString(),
                    update_only_runway: req.query?.update_only_runway ? true : false
                };

                const runway: CompanyWarehouseRunway = req.body.runway;


                try {

                    if (!await companyWarehouseRunwaysCheckerService.runwayExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'runway_not_found', message: 'Runway did not found' }, res);


                    if (!runway?.runway_code || !runway?.runway_name)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be updated' }, res);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }



                try {

                    // update runway's data
                    const result = await mysql.query(`
                        UPDATE
                            company_warehouses__runways
                        SET
                            ${runway?.runway_name ? `runway_name = '${runway.runway_name}',` : ``}
                            ${runway?.runway_code ? `runway_code = '${runway.runway_code}',` : ``}
                            runway_id = :runway_id
                        WHERE
                            runway_id = :runway_id AND
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id
                    `, params);


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }




                if (!params?.update_only_runway)
                    try {
                        // implement the updating of all sub-objects (columns & shelfs)


                        let sql_query = '';

                        for (const column of runway.columns) {
                            if (column?.column_id)
                                sql_query += `
                                    UPDATE
                                        company_warehouses__columns
                                    SET
                                        column_name = '${column.column_name}',
                                        column_code = '${column.column_code}'
                                    WHERE
                                        column_id = '${column.column_id}' AND
                                        connected_account_id = :connected_account_id AND
                                        warehouse_id = :warehouse_id AND
                                        runway_id = :runway_id;
                                `;
                            else {
                                column.runway_id = params.runway_id;
                                column.connected_account_id = params.connected_account_id;
                                column.warehouse_id = params.warehouse_id;
                                column.column_id = companyWarehousesIDNumbersGenerator.getColumnID();

                                sql_query += `
                                    INSERT INTO
                                        company_warehouses_columns
                                    SET
                                        column_id = '${column.column_id}',
                                        connected_account_id = :connected_account_id,
                                        warehouse_id = :warehouse_id,
                                        runway_id = :runway_id,
                                        column_name = '${column.column_name}',
                                        column_code = '${column.column_code}';
                                `;
                            }

                            for (const shelf of column.shelf)
                                if (!shelf?.shelf_id)
                                    sql_query += `
                                        INSERT INTO
                                            company_warehouses__column_shelfs
                                        SET
                                            shelf_id = '${companyWarehousesIDNumbersGenerator.getShelfID()}',
                                            connected_account_id = :connected_account_id,
                                            warehouse_id = :warehouse_id,
                                            runway_id = :runway_id,
                                            column_id = '${column.column_id}',
                                            shelf_code = '${shelf.shelf_code}';
                                    `;
                                else
                                    sql_query += `
                                        UPDATE
                                            company_warehouses__column_shelfs
                                        SET
                                            shelf_code = '${shelf.shelf_code}'
                                        WHERE
                                            shelf_id = '${shelf.shelf_id}' AND
                                            connected_account_id = :connected_account_id AND
                                            warehouse_id = :warehouse_id AND
                                            runway_id = :runway_id AND
                                            column_id = '${column.column_id}';
                                    `;
                        }



                        const result = await mysql.query(sql_query, params);

                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }




                return res.status(200).send({ code: 200, type: 'runway_updated', message: 'Runway updated successfully' });

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        runway_id: string;
                        connected_account_id: string;
                        warehouse_id: string;
                    } = {
                        runway_id: req.params.runway_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString()
                    };


                    const runway: CompanyWarehouseRunway = req.body.runway;

                    if (!await companyWarehouseRunwaysCheckerService.runwayExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'runway_not_found', message: 'Runway did not found' }, res);


                    const result = await mysql.query(`
                        DELETE FROM
                            company_warehouses__runways
                        WHERE
                            runway_id = :runway_id AND
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id
                    `, params);


                    return res.status(200).send({ code: 200, type: 'runway_deleted', message: 'Runway deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // add new runway
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/r/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                const params: {
                    warehouse_id: string;
                    connected_account_id: string;
                    save_columns: boolean;
                } = {
                    warehouse_id: req.params.warehouse_id.toString(),
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    save_columns: Boolean(req?.query?.save_columns) ? true : false,
                };

                let runway: CompanyWarehouseRunway = req.body.runway;



                // check
                try {

                    if (!runway?.runway_name || !runway?.runway_code)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data_to_be_saved', message: 'Missing data to be saved' }, res);

                    if (!await companyWarehouseCheckerService?.warehouseExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'warehouse_not_found', message: 'Warehouse did not found' }, res);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }




                try {

                    runway = {
                        ...runway,
                        runway_id: companyWarehousesIDNumbersGenerator.getRunwayID(),
                        connected_account_id: params.connected_account_id,
                        warehouse_id: params.warehouse_id,
                    };



                    const result = await mysql.query(`
                        INSERT INTO
                            company_warehouses__runways
                        SET
                            runway_id = :runway_id,
                            connected_account_id = :connected_account_id,
                            warehouse_id = :warehouse_id,
                            runway_name = :runway_name,
                            runway_code = :runway_code;
                    `, runway);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }





                // save columns
                if (params?.save_columns)
                    try {

                        let sql_query = '';
                        for (const column of runway.columns) {
                            column.column_id = companyWarehousesIDNumbersGenerator.getColumnID();

                            sql_query += `
                                INSERT INTO
                                    company_warehouses__columns
                                SET
                                    column_id = '${column.column_id}',
                                    connected_account_id = :connected_account_id,
                                    warehouse_id = :warehouse_id,
                                    runway_id = '${runway.runway_id}',
                                    column_name = '${column.column_name}',
                                    column_code = '${column.column_code}';
                            `;


                            for (const shelf of column.shelf)
                                sql_query += `
                                    INSERT INTO
                                        company_warehouses__column_shelfs
                                    SET
                                        shelf_id = '${companyWarehousesIDNumbersGenerator.getShelfID()}',
                                        connected_account_id = :connected_account_id,
                                        warehouse_id = :warehouse_id,
                                        runway_id = '${runway.runway_id}',
                                        column_id = '${column.column_id}',
                                        shelf_code = '${shelf.shelf_code}';
                                `;
                        }



                        const result = await mysql.query(sql_query, {
                            connected_account_id: params.connected_account_id,
                            warehouse_id: params.warehouse_id,
                        });

                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }





                return res.status(200).send({ code: 200, type: 'runway_added', message: 'New runway successfully added!', runway_id: runway.runway_id });

            });


    }


}
