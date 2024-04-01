// CompanyAPIConnectionsKeyType
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const CompanyAPIConnectionsKeyType = new GraphQLObjectType({

    name: 'CompanyAPIConnectionsKeyType',
    fields: () => ({

        token_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        token_value: { type: GraphQLString },
        created_at: { type: GraphQLString },
        products_open: { type: GraphQLBoolean },
        product_categories_open: { type: GraphQLBoolean },
        newsletter_open: { type: GraphQLBoolean },
        cart_checkout_open: { type: GraphQLBoolean }

    })

});



export { CompanyAPIConnectionsKeyType };
