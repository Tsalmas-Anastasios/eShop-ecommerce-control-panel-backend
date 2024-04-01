import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const NewsletterClientEmail = new GraphQLObjectType({

    name: 'NewsletterClientEmail',
    fields: () => ({

        rec_id: { type: GraphQLString },
        client_email: { type: GraphQLString },
        client_name: { type: GraphQLString },
        connected_account_id: { type: GraphQLString }

    })

});



export { NewsletterClientEmail };
