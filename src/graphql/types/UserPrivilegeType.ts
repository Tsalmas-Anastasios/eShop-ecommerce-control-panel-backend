import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { User } from '../../models';



// tslint:disable-next-line:variable-name
const UserPrivilegeType = new GraphQLObjectType({

    name: 'UserPrivilegeType',
    fields: () => ({

        rec_id: { type: GraphQLInt },
        privilege_type: { type: GraphQLString },
        value: { type: GraphQLInt },
        user_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

    })

});

export { UserPrivilegeType };
