import { GraphQlSearchProductsParamsArgs } from '../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { CompanyWarehouseRunway } from '../../models';


import { CompanyWarehouseColumnType } from './CompanyWarehouseColumnType';





// tslint:disable-next-line:variable-name
const CompanyWarehouseRunwayType = new GraphQLObjectType({
    name: 'CompanyWarehouseRunwayType',
    fields: () => ({

        runway_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        warehouse_id: { type: GraphQLString },
        runway_name: { type: GraphQLString },
        runway_code: { type: GraphQLString },

        columns: {
            type: new GraphQLList(CompanyWarehouseColumnType),
            resolve: async (runway: CompanyWarehouseRunway, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__columns
                        WHERE
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id AND
                            runway_id = :runway_id
                    `, {
                        connected_account_id: runway.connected_account_id,
                        warehouse_id: runway.warehouse_id,
                        runway_id: runway.runway_id
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

export { CompanyWarehouseRunwayType };
