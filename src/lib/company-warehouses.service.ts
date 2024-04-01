import { Request } from 'express';
import {
    CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';





class CompanyWarehousesGetList {


    async getWarehouses(params?: { warehouse_id?: string, connected_account_id?: string }, req?: Request): Promise<CompanyWarehouse[]> {

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
                        companyWarehouses${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            warehouse_id
                            distinctive_title
                            code_name
                            ownership_type
                            square_meters
                            power_type
                            warehouse_license_number
                            building_permit_number
                            building_year
                            reception_exist
                            parking_spaces
                            unloading_vehicles_places_number
                            energy_class
                            bathrooms_number
                            offices_number
                            plot__street
                            plot__postal_code
                            plot__country
                            plot__city
                            plot__state
                            plot__latitude
                            plot__longitude
                            contact__street
                            contact__postal_code
                            contact__country
                            contact__city
                            contact__state
                            contact__latitude
                            contact__longitude
                            contact__phone
                            warehouse_manager__fullname
                            warehouse_manager__company_position
                            warehouse_manager__date_of_birth
                            warehouse_manager__social_security_number
                            warehouse_manager__personal_tax_id
                            warehouse_manager__phone
                            warehouse_manager__phone2
                            warehouse_manager__company_email
                            warehouse_manager__personal_email

                            runways{

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
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const warehouses: CompanyWarehouse[] = result.data.companyWarehouses as CompanyWarehouse[];

            return Promise.resolve(warehouses);

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async getWarehouse(params: { warehouse_id: string, connected_account_id: string }, req?: Request): Promise<CompanyWarehouse> {

        try {

            const warehouses: CompanyWarehouse[] = await this.getWarehouses(params, req || null);
            if (warehouses.length <= 0)
                return Promise.resolve(null);

            return Promise.resolve(warehouses[0] as CompanyWarehouse);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class CompanyWarehouseCheckerService {


    async warehouseExists(params: { warehouse_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`SELECT warehouse_id FROM company_warehouses WHERE warehouse_id = :warehouse_id AND connected_account_id = :connected_account_id`, params);

            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class CompanyWarehousePutUpdateService {


    async updateWarehouseBasicData(
        params: { connected_account_id: string, warehouse_id: string },
        warehouse: CompanyWarehouse
    ): Promise<void> {

        try {


            const result = await mysql.query(`
                UPDATE
                    company_warehouses
                SET
                    ${warehouse?.distinctive_title ? `distinctive_title = '${warehouse.distinctive_title}',` : ``}
                    ${warehouse?.code_name ? `code_name = '${warehouse.code_name}',` : ``}
                    ${warehouse?.ownership_type ? `ownership_type = '${warehouse.ownership_type}',` : ``}
                    ${warehouse?.square_meters ? `square_meters = '${warehouse.square_meters}',` : ``}
                    ${warehouse?.power_type ? `power_type = '${warehouse.power_type}',` : ``}
                    ${warehouse?.warehouse_license_number ? `warehouse_license_number = '${warehouse.warehouse_license_number}',` : ``}
                    ${warehouse?.building_permit_number ? `building_permit_number = '${warehouse.building_permit_number}',` : ``}
                    ${warehouse?.building_year ? `building_year = '${warehouse.building_year}',` : ``}
                    ${warehouse?.reception_exist ? `reception_exist = '${warehouse.reception_exist}',` : ``}
                    ${warehouse?.parking_spaces ? `parking_spaces = '${warehouse.parking_spaces}',` : ``}
                    ${warehouse?.unloading_vehicles_places_number ? `unloading_vehicles_places_number = '${warehouse.unloading_vehicles_places_number}',` : ``}
                    ${warehouse?.energy_class ? `energy_class = '${warehouse.energy_class}',` : ``}
                    ${warehouse?.bathrooms_number ? `bathrooms_number = '${warehouse.bathrooms_number}',` : ``}
                    ${warehouse?.offices_number ? `offices_number = '${warehouse.offices_number}',` : ``}
                    ${warehouse?.plot__street ? `plot__street = '${warehouse.plot__street}',` : ``}
                    ${warehouse?.plot__postal_code ? `plot__postal_code = '${warehouse.plot__postal_code}',` : ``}
                    ${warehouse?.plot__country ? `plot__country = '${warehouse.plot__country}',` : ``}
                    ${warehouse?.plot__city ? `plot__city = '${warehouse.plot__city}',` : ``}
                    ${warehouse?.plot__state ? `plot__state = '${warehouse.plot__state}',` : ``}
                    ${warehouse?.plot__latitude ? `plot__latitude = '${warehouse.plot__latitude}',` : ``}
                    ${warehouse?.plot__longitude ? `plot__longitude = '${warehouse.plot__longitude}',` : ``}
                    ${warehouse?.contact__street ? `contact__street = '${warehouse.contact__street}',` : ``}
                    ${warehouse?.contact__postal_code ? `contact__postal_code = '${warehouse.contact__postal_code}',` : ``}
                    ${warehouse?.contact__country ? `contact__country = '${warehouse.contact__country}',` : ``}
                    ${warehouse?.contact__city ? `contact__city = '${warehouse.contact__city}',` : ``}
                    ${warehouse?.contact__state ? `contact__state = '${warehouse.contact__state}',` : ``}
                    ${warehouse?.contact__state ? `contact__state = '${warehouse.contact__state}',` : ``}
                    ${warehouse?.contact__latitude ? `contact__latitude = '${warehouse.contact__latitude}',` : ``}
                    ${warehouse?.contact__longitude ? `contact__longitude = '${warehouse.contact__longitude}',` : ``}
                    ${warehouse?.warehouse_manager__fullname ? `warehouse_manager__fullname = '${warehouse.warehouse_manager__fullname}',` : ``}
                    ${warehouse?.warehouse_manager__company_position ? `warehouse_manager__company_position = '${warehouse.warehouse_manager__company_position}',` : ``}
                    ${warehouse?.warehouse_manager__date_of_birth ? `warehouse_manager__date_of_birth = '${warehouse.warehouse_manager__date_of_birth}',` : ``}
                    ${warehouse?.warehouse_manager__social_security_number ? `warehouse_manager__social_security_number = '${warehouse.warehouse_manager__social_security_number}',` : ``}
                    ${warehouse?.warehouse_manager__personal_tax_id ? `warehouse_manager__personal_tax_id = '${warehouse.warehouse_manager__personal_tax_id}',` : ``}
                    ${warehouse?.warehouse_manager__phone ? `warehouse_manager__phone = '${warehouse.warehouse_manager__phone}',` : ``}
                    ${warehouse?.warehouse_manager__phone2 ? `warehouse_manager__phone2 = '${warehouse.warehouse_manager__phone2}',` : ``}
                    ${warehouse?.warehouse_manager__company_email ? `warehouse_manager__company_email = '${warehouse.warehouse_manager__company_email}',` : ``}
                    ${warehouse?.warehouse_manager__personal_email ? `warehouse_manager__personal_email = '${warehouse.warehouse_manager__personal_email}',` : ``}
                    warehouse_id = :warehouse_id
                WHERE
                    warehouse_id = :warehouse_id AND
                    connected_account_id = :connected_account_id
            `, {
                warehouse_id: params.warehouse_id,
                connected_account_id: params.connected_account_id
            });


        } catch (error) {
            Promise.reject(error);
        }

    }


}




class CompanyWarehouseDeleteService {


    async deleteWarehouse(params: { warehouse_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`DELETE FROM company_warehouses WHERE warehouse_id = :warehouse_id AND connected_account_id = :connected_account_id`, params);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CompanyWarehousePostAddService {


    async addNewWarehouse(warehouse: CompanyWarehouse): Promise<void> {

        try {


            const result = await mysql.query(`
                INSERT INTO
                    company_warehouses
                SET
                    warehouse_id = :warehouse_id,
                    connected_account_id = :connected_account_id,
                    distinctive_title = :distinctive_title,
                    code_name = :code_name,
                    ownership_type = :ownership_type,
                    square_meters = :square_meters,
                    power_type = :power_type,
                    warehouse_license_number = :warehouse_license_number,
                    building_permit_number = :building_permit_number,
                    building_year = :building_year,
                    reception_exist = :reception_exist,
                    parking_spaces = :parking_spaces,
                    unloading_vehicles_places_number = :unloading_vehicles_places_number,
                    energy_class = :energy_class,
                    bathrooms_number = :bathrooms_number,
                    offices_number = :offices_number,
                    plot__street = :plot__street,
                    plot__postal_code = :plot__postal_code,
                    plot__country = :plot__country,
                    plot__city = :plot__city,
                    plot__state = :plot__state,
                    plot__latitude = :plot__latitude,
                    plot__longitude = :plot__longitude,
                    contact__street = :contact__street,
                    contact__postal_code = :contact__postal_code,
                    contact__country = :contact__country,
                    contact__city = :contact__city,
                    contact__state = :contact__state,
                    contact__latitude = :contact__latitude,
                    contact__longitude = :contact__longitude,
                    contact__phone = :contact__phone,
                    warehouse_manager__fullname = :warehouse_manager__fullname,
                    warehouse_manager__company_position = :warehouse_manager__company_position,
                    warehouse_manager__date_of_birth = :warehouse_manager__date_of_birth,
                    warehouse_manager__social_security_number = :warehouse_manager__social_security_number,
                    warehouse_manager__personal_tax_id = :warehouse_manager__personal_tax_id,
                    warehouse_manager__phone = :warehouse_manager__phone,
                    ${warehouse?.warehouse_manager__phone2 ? `warehouse_manager__phone2 = '${warehouse.warehouse_manager__phone2}',` : ``}
                    warehouse_manager__company_email = :warehouse_manager__company_email,
                    warehouse_manager__personal_email = :warehouse_manager__personal_email
            `, warehouse);


        } catch (error) {
            return Promise.reject(error);
        }

    }




    async addRunways(runways: CompanyWarehouseRunway[]): Promise<void> {

        try {

            let query = '';
            for (const runway of runways)
                query += `
                    INSERT INTO
                        company_warehouses__runways
                    SET
                        runway_id = '${runway.runway_id}',
                        connected_account_id = '${runway.connected_account_id}',
                        warehouse_id = '${runway.warehouse_id}',
                        runway_name = '${runway.runway_name}',
                        runway_code = '${runway.runway_code}';
                `;


            const result = await mysql.query(query);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async addColumns(runways: CompanyWarehouseRunway[]): Promise<void> {

        try {


            let query = '';
            for (const runway of runways)
                for (const column of runway.columns)
                    query += `
                        INSERT INTO
                            company_warehouses__columns
                        SET
                            column_id = '${column.column_id}',
                            connected_account_id = '${column.connected_account_id}',
                            warehouse_id = '${column.warehouse_id}',
                            runway_id = '${column.runway_id}',
                            column_name = '${column.column_name}',
                            column_code = '${column.column_code}';
                    `;


            const result = await mysql.query(query);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async addColumnsShelf(runways: CompanyWarehouseRunway[]): Promise<void> {

        try {


            let query = '';
            for (const runway of runways)
                for (const column of runway.columns)
                    for (const one_shelf of column.shelf)
                        query += `
                            INSERT INTO
                                company_warehouses__column_shelfs
                            SET
                                shelf_id = '${one_shelf.shelf_id}',
                                connected_account_id = '${one_shelf.connected_account_id}',
                                warehouse_id = '${one_shelf.warehouse_id}',
                                runway_id = '${one_shelf.runway_id}',
                                column_id = '${one_shelf.column_id}',
                                shelf_code = '${one_shelf.shelf_code}';
                        `;


            const result = await mysql.query(query);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




const companyWarehousesGetList = new CompanyWarehousesGetList();
const companyWarehouseCheckerService = new CompanyWarehouseCheckerService();
const companyWarehousePutUpdateService = new CompanyWarehousePutUpdateService();
const companyWarehouseDeleteService = new CompanyWarehouseDeleteService();
const companyWarehousePostAddService = new CompanyWarehousePostAddService();
export {
    companyWarehousesGetList, companyWarehousePutUpdateService, companyWarehouseCheckerService,
    companyWarehouseDeleteService, companyWarehousePostAddService
};
