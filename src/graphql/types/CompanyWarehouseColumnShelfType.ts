import { GraphQlSearchProductsParamsArgs } from '../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';






// tslint:disable-next-line:variable-name
const CompanyWarehouseColumnShelfType = new GraphQLObjectType({
    name: 'CompanyWarehouseColumnShelfType',
    fields: () => ({

        shelf_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        warehouse_id: { type: GraphQLString },
        runway_id: { type: GraphQLString },
        column_id: { type: GraphQLString },
        shelf_code: { type: GraphQLString },

    })
});

export { CompanyWarehouseColumnShelfType };
