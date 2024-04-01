import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { Product } from '../../models';



// tslint:disable-next-line:variable-name
const OrderTransactionType = new GraphQLObjectType({

    name: 'OrderTransactionType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        order_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        updated_by: { type: GraphQLString },
        order_created_at: { type: GraphQLString },
        order_seen: { type: GraphQLBoolean },
        whole_order_updated: { type: GraphQLBoolean },
        status_updated: { type: GraphQLBoolean },
        status_before: { type: GraphQLString },
        status_after: { type: GraphQLString },
        field_changed: { type: GraphQLString },
        value_before: { type: GraphQLString },
        value_after: { type: GraphQLString },
        created_at: { type: GraphQLString },

    })

});

export { OrderTransactionType };
