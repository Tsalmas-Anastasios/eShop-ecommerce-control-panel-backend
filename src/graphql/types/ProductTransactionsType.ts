import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { Product } from '../../models';



// tslint:disable-next-line:variable-name
const ProductTransactionsType = new GraphQLObjectType({

    name: 'ProductTransactionsType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        product_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        updated_by: { type: GraphQLString },
        product_created_at: { type: GraphQLString },
        whole_product_update: { type: GraphQLBoolean },
        product_update_categories: { type: GraphQLBoolean },
        added_category: { type: GraphQLString },
        removed_category: { type: GraphQLString },
        product_update_images: { type: GraphQLBoolean },
        field_changed: { type: GraphQLString },
        value_before: { type: GraphQLString },
        value_after: { type: GraphQLString },
        quantity_sold: { type: GraphQLInt },
        quantity_added: { type: GraphQLInt },
        quantity_removed: { type: GraphQLInt },
        warehouse_id: { type: GraphQLString },
        runway_id: { type: GraphQLString },
        column_id: { type: GraphQLString },
        column_shelf_id: { type: GraphQLString },
        purchased_price: { type: GraphQLInt },
        status_changed: { type: GraphQLBoolean },
        status_before: { type: GraphQLString },
        status_after: { type: GraphQLString },
        created_at: { type: GraphQLString },

    })

});

export { ProductTransactionsType };
