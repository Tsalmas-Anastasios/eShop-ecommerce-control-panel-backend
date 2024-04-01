import { Application, Request, Response, request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';

import { companyWarehousesColumnsShelfGetListService, companyWarehousesColumnsShelfCheckerService } from '../lib/company-warehouses-columns-shelf.service';
import { companyWarehousesColumnsCheckerService } from '../lib/company-warehouses-columns.service';
import { companyWarehousesIDNumbersGenerator } from '../lib/id_numbers_generators/company-warehouse';





export class CompanyWarehouseColumnsShelfRoutes {


    public routes(server: Application) {


        // all shelf
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns/:column_id/shelf')
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


                    const shelf: CompanyWarehouseColumnShelf[] = await companyWarehousesColumnsShelfGetListService.getShelf(params, req);

                    return res.status(200).send(shelf);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


        // specific shelf
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns/:column_id/shelf/:shelf_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        shelf_id: string;
                        connected_account_id: string;
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                    } = {
                        shelf_id: req.params.shelf_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                    };


                    const one_shelf = await companyWarehousesColumnsShelfGetListService.getSpecificShelf(params, req);

                    return res.status(200).send(one_shelf);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        shelf_id: string;
                        connected_account_id: string;
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                    } = {
                        shelf_id: req.params.shelf_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                    };

                    const shelf: CompanyWarehouseColumnShelf = req.body.shelf;

                    if (!await companyWarehousesColumnsShelfCheckerService.shelfExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'shelf_not_exist', message: 'Shelf did not found' }, res);

                    if (!shelf?.shelf_code)
                        return res.status(200).send({ code: 200, type: 'nothing_to_update', message: 'Nothing to update' });



                    const result = await mysql.query(`
                        UPDATE
                            company_warehouses__column_shelfs
                        SET
                            shelf_code = :shelf_code
                        WHERE
                            shelf_id = :shelf_id AND
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id AND
                            runway_id = :runway_id AND
                            column_id = :column_id
                    `, {
                        shelf_code: shelf.shelf_code,
                        ...params
                    });


                    return res.status(200).send({ code: 200, type: 'shelf_updated', message: 'Shelf updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        shelf_id: string;
                        connected_account_id: string;
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                    } = {
                        shelf_id: req.params.shelf_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                    };


                    if (!await companyWarehousesColumnsShelfCheckerService.shelfExists(params))
                        return utils.errorHandlingReturn({ code: 404, type: 'shelf_not_exist', message: 'Shelf did not found' }, res);


                    const result = await mysql.query(`
                        DELETE FROM
                            company_warehouses__column_shelfs
                        WHERE
                            shelf_id = :shelf_id AND
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id AND
                            runway_id = :runway_id AND
                            column_id = :column_id
                    `, params);


                    return res.status(200).send({ code: 200, type: 'shelf_deleted', message: 'Shelf deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // add shelf
        server.route('/api/settings/company-data/warehouses/:warehouse_id/runways/:runway_id/columns/:column_id/shelf/s/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        connected_account_id: string;
                        warehouse_id: string;
                        runway_id: string;
                        column_id: string;
                    } = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        warehouse_id: req.params.warehouse_id.toString(),
                        runway_id: req.params.runway_id.toString(),
                        column_id: req.params.column_id.toString(),
                    };


                    const shelf_code: string = req.body.shelf_code.toString();


                    const shelf: CompanyWarehouseColumnShelf = {
                        shelf_id: companyWarehousesIDNumbersGenerator.getShelfID(),
                        shelf_code: shelf_code,
                        ...params
                    };



                    const result = await mysql.query(`
                        INSERT INTO
                            company_warehouses__column_shelfs
                        SET
                            shelf_id = :shelf_id,
                            connected_account_id = :connected_account_id,
                            warehouse_id = :warehouse_id,
                            runway_id = :runway_id,
                            column_id = :column_id,
                            shelf_code = :shelf_code
                    `, shelf);


                    return res.status(200).send({ code: 200, type: 'shelf_saved', message: 'Shelf saved successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }


}
