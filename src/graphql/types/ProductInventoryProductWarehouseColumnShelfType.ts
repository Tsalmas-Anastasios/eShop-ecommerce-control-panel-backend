import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';






// tslint:disable-next-line:variable-name
const ProductInventoryProductWarehouseColumnShelfType = new GraphQLObjectType({
    name: 'ProductInventoryProductWarehouseColumnShelfType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        rec_product_id: { type: GraphQLString },
        rec_warehouse_id: { type: GraphQLString },
        rec_runway_id: { type: GraphQLString },
        rec_column_id: { type: GraphQLString },
        shelf_id: { type: GraphQLString },
        shelf_code: { type: GraphQLString },
        shelf_total_stock: { type: GraphQLInt },

    })
});

export { ProductInventoryProductWarehouseColumnShelfType };
