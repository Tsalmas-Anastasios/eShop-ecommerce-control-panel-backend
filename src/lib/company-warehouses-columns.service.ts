import { Request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';







class CompanyWarehousesColumnsGetListService {


    async getColumns(
        params?: {
            column_id?: string;
            connected_account_id?: string;
            warehouse_id?: string;
            runway_id?: string;
        },
        req?: Request
    ): Promise<CompanyWarehouseColumn[]> {

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
                        companyWarehousesColumns${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            column_id
                            column_name
                            column_code

                            shelf{

                                shelf_id
                                shelf_code

                            }

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const columns: CompanyWarehouseColumn[] = result.data.companyWarehousesColumns as CompanyWarehouseColumn[];


            return Promise.resolve(columns);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificColumn(
        params: {
            column_id: string;
            connected_account_id?: string;
            warehouse_id?: string;
            runway_id?: string;
        },
        req?: Request
    ): Promise<CompanyWarehouseColumn> {

        try {

            const columns: CompanyWarehouseColumn[] = await this.getColumns(params, req || null);
            if (columns.length <= 0)
                return Promise.resolve(null);

            return Promise.resolve(columns[0] as CompanyWarehouseColumn);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CompanyWarehousesColumnsCheckerService {


    async columnExists(params: {
        warehouse_id: string;
        runway_id: string;
        column_id: string;
        connected_account_id: string;
    }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    column_id
                FROM
                    company_warehouses__columns
                WHERE
                    column_id = :column_id AND
                    runway_id = :runway_id AND
                    warehouse_id = :warehouse_id AND
                    connected_account_id = :connected_account_id
            `, params);


            if (result.rowsCount <= 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



const companyWarehousesColumnsGetListService = new CompanyWarehousesColumnsGetListService();
const companyWarehousesColumnsCheckerService = new CompanyWarehousesColumnsCheckerService();
export { companyWarehousesColumnsGetListService, companyWarehousesColumnsCheckerService };
