import { Request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';




class CompanyWarehousesColumnsShelfGetListService {


    async getShelf(
        params?: {
            shelf_id?: string;
            connected_account_id?: string;
            warehouse_id?: string;
            runway_id?: string;
            column_id?: string;
        },
        req?: Request
    ): Promise<CompanyWarehouseColumnShelf[]> {

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
                        companyWarehouseColumnsShelf${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            shelf_id
                            shelf_code

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const shelf: CompanyWarehouseColumnShelf[] = result.data.companyWarehouseColumnsShelf as CompanyWarehouseColumnShelf[];

            return Promise.resolve(shelf);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificShelf(
        params: {
            shelf_id: string;
            connected_account_id: string;
            warehouse_id: string;
            runway_id: string;
            column_id: string;
        },
        req?: Request
    ): Promise<CompanyWarehouseColumnShelf> {

        try {

            const shelf: CompanyWarehouseColumnShelf[] = await this.getShelf(params, req || null);
            if (shelf.length <= 0)
                return Promise.resolve(null);

            return Promise.resolve(shelf[0] as CompanyWarehouseColumnShelf);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CompanyWarehousesColumnsShelfCheckerService {


    async shelfExists(params: {
        shelf_id: string;
        connected_account_id: string;
        warehouse_id: string;
        runway_id: string;
        column_id: string;
    }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    shelf_id
                FROM
                    company_warehouses__column_shelfs
                WHERE
                    shelf_id = :shelf_id AND
                    connected_account_id = :connected_account_id AND
                    warehouse_id = :warehouse_id AND
                    runway_id = :runway_id AND
                    column_id = :column_id
            `, params);


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




const companyWarehousesColumnsShelfGetListService = new CompanyWarehousesColumnsShelfGetListService();
const companyWarehousesColumnsShelfCheckerService = new CompanyWarehousesColumnsShelfCheckerService();
export { companyWarehousesColumnsShelfGetListService, companyWarehousesColumnsShelfCheckerService };
