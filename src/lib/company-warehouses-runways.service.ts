import { Request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';




class CompanyWarehouseRunwaysGetList {


    async getRunways(
        params?: { runway_id?: string, connected_account_id?: string, warehouse_id?: string },
        req?: Request
    ): Promise<CompanyWarehouseRunway[]> {

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
                        companyWarehousesRunways${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            runway_id
                            runway_name
                            runway_code

                            columns{

                                column_id
                                column_name
                                column_code

                                shelf{

                                    shelf_id
                                    shelf_code

                                }

                            }

                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const runways: CompanyWarehouseRunway[] = result.data.companyWarehousesRunways as CompanyWarehouseRunway[];


            return Promise.resolve(runways);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificRunway(
        params: { runway_id?: string, connected_account_id?: string, warehouse_id?: string },
        req?: Request
    ): Promise<CompanyWarehouseRunway> {

        try {

            const runways: CompanyWarehouseRunway[] = await this.getRunways(params, req || null);
            if (runways.length <= 0)
                return Promise.resolve(null);

            return Promise.resolve(runways[0] as CompanyWarehouseRunway);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class CompanyWarehouseRunwaysCheckerService {


    async runwayExists(params: { runway_id: string, connected_account_id: string, warehouse_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    runway_id
                FROM
                    company_warehouses__runways
                WHERE
                    runway_id = :runway_id AND
                    connected_account_id = :connected_account_id AND
                    warehouse_id = :warehouse_id
            `, params);


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}








const companyWarehouseRunwaysGetList = new CompanyWarehouseRunwaysGetList();
const companyWarehouseRunwaysCheckerService = new CompanyWarehouseRunwaysCheckerService();
export { companyWarehouseRunwaysGetList, companyWarehouseRunwaysCheckerService };
