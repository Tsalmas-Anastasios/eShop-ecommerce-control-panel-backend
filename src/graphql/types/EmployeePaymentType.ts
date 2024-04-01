import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';





// tslint:disable-next-line:variable-name
const EmployeePaymentType = new GraphQLObjectType({

    name: 'EmployeePaymentType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        employee_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        version_label: { type: GraphQLString },
        hourly_payment: { type: GraphQLString },
        payment_frequency: { type: GraphQLString },
        hours_per_day: { type: GraphQLInt },
        initial_payment_date: { type: GraphQLString },
        active: { type: GraphQLBoolean },

    })

});




export { EmployeePaymentType };
