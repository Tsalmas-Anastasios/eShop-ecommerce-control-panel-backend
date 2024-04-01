import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const OrderConfirmationType = new GraphQLObjectType({
    name: 'OrderConfirmationType',
    fields: () => ({

        shop_logo: { type: GraphQLString },
        shop_url: { type: GraphQLString },
        shop_name: { type: GraphQLString },
        shop_google_rate_url: { type: GraphQLString },

    })
});

export { OrderConfirmationType };
