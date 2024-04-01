import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { Product } from '../../models';



// tslint:disable-next-line:variable-name
const ProductStockType = new GraphQLObjectType({

    name: 'ProductStockType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        product_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        warehouse_id: { type: GraphQLString },
        runway_id: { type: GraphQLString },
        column_id: { type: GraphQLString },
        column_shelf_id: { type: GraphQLString },
        stock_quantity: { type: GraphQLInt },

    })

});

export { ProductStockType };
