import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';



// tslint:disable-next-line:variable-name
const CompanyEmailDataType = new GraphQLObjectType({

    name: 'CompanyEmailDataType',
    fields: () => ({

        email_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        email_label: { type: GraphQLString },
        host: { type: GraphQLString },
        port: { type: GraphQLInt },
        secure: { type: GraphQLBoolean },
        user: { type: GraphQLString },
        password: { type: GraphQLString },
        default_name: { type: GraphQLString },
        default_email: { type: GraphQLString },

    })

});



export { CompanyEmailDataType };
