import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';





// tslint:disable-next-line:variable-name
const EmployeeDonePaymentsType = new GraphQLObjectType({

    name: 'EmployeeDonePaymentsType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        employee_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        payment_version_id: { type: GraphQLString },
        payment_date_time: { type: GraphQLString },
        status: { type: GraphQLString },

    })

});




export { EmployeeDonePaymentsType };
