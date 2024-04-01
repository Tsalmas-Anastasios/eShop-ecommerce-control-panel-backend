import { GraphQlSearchProductsParamsArgs } from '../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { CompanyWarehouse } from '../../models';

import { CompanyWarehouseRunwayType } from './CompanyWarehouseRunwaysType';






// tslint:disable-next-line:variable-name
const CompanyWarehouseType = new GraphQLObjectType({
    name: 'CompanyWarehouseType',
    fields: () => ({

        warehouse_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        distinctive_title: { type: GraphQLString },
        code_name: { type: GraphQLString },
        ownership_type: { type: GraphQLString },
        square_meters: { type: GraphQLFloat },
        power_type: { type: GraphQLString },
        warehouse_license_number: { type: GraphQLString },
        building_permit_number: { type: GraphQLString },
        building_year: { type: GraphQLString },
        reception_exist: { type: GraphQLBoolean },
        parking_spaces: { type: GraphQLFloat },
        unloading_vehicles_places_number: { type: GraphQLFloat },
        energy_class: { type: GraphQLString },
        bathrooms_number: { type: GraphQLFloat },
        offices_number: { type: GraphQLFloat },
        plot__street: { type: GraphQLString },
        plot__postal_code: { type: GraphQLString },
        plot__country: { type: GraphQLString },
        plot__city: { type: GraphQLString },
        plot__state: { type: GraphQLString },
        plot__latitude: { type: GraphQLFloat },
        plot__longitude: { type: GraphQLFloat },
        contact__street: { type: GraphQLString },
        contact__postal_code: { type: GraphQLString },
        contact__country: { type: GraphQLString },
        contact__city: { type: GraphQLString },
        contact__state: { type: GraphQLString },
        contact__latitude: { type: GraphQLFloat },
        contact__longitude: { type: GraphQLFloat },
        contact__phone: { type: GraphQLString },
        warehouse_manager__fullname: { type: GraphQLString },
        warehouse_manager__company_position: { type: GraphQLString },
        warehouse_manager__date_of_birth: { type: GraphQLString },
        warehouse_manager__social_security_number: { type: GraphQLString },
        warehouse_manager__personal_tax_id: { type: GraphQLString },
        warehouse_manager__phone: { type: GraphQLString },
        warehouse_manager__phone2: { type: GraphQLString },
        warehouse_manager__company_email: { type: GraphQLString },
        warehouse_manager__personal_email: { type: GraphQLString },

        runways: {
            type: new GraphQLList(CompanyWarehouseRunwayType),
            resolve: async (warehouse: CompanyWarehouse, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__runways
                        WHERE
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id
                    `, {
                        connected_account_id: warehouse.connected_account_id,
                        warehouse_id: warehouse.warehouse_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        }

    })
});

export { CompanyWarehouseType };
