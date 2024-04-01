import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { User } from '../../models';



// tslint:disable-next-line:variable-name
const SessionUserType = new GraphQLObjectType({

    name: 'SessionUserType',
    fields: () => ({

        sid: { type: GraphQLString },
        expires: { type: GraphQLInt },
        data: { type: GraphQLString },

    })

});

export { SessionUserType };
