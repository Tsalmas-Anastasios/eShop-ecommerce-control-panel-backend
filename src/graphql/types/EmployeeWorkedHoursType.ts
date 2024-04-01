import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';






// tslint:disable-next-line:variable-name
const EmployeeWorkedHoursType = new GraphQLObjectType({

    name: 'EmployeeWorkedHoursType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        employee_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        date_day: { type: GraphQLString },
        start_time: { type: GraphQLString },
        end_time: { type: GraphQLString },
        status: { type: GraphQLString },

    })

});




export { EmployeeWorkedHoursType };
