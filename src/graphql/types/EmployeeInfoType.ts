import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { EmployeeInfoData } from '../../models';

// graphql types
import { EmployeeDonePaymentsType } from './EmployeeDonePaymentsType';
import { EmployeePaymentType } from './EmployeePaymentType';
import { EmployeeWorkedHoursType } from './EmployeeWorkedHoursType';




// tslint:disable-next-line:variable-name
const EmployeeInfoType = new GraphQLObjectType({

    name: 'EmployeeInfoType',
    fields: () => ({

        employee_id: { type: GraphQLString },
        first_name: { type: GraphQLString },
        middle_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        fathers_name: { type: GraphQLString },
        mothers_name: { type: GraphQLString },
        mother_last_name: { type: GraphQLString },
        tax_id: { type: GraphQLString },
        social_security_number_amka: { type: GraphQLString },
        date_of_birth: { type: GraphQLString },
        date_of_birth_epoch: { type: GraphQLInt },
        company: { type: GraphQLString },
        position: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        work_phone_number: { type: GraphQLString },
        home_phone_number: { type: GraphQLString },
        other_phone_number: { type: GraphQLString },
        email: { type: GraphQLString },
        work_email: { type: GraphQLString },
        other_email: { type: GraphQLString },
        address: { type: GraphQLString },
        postal_code: { type: GraphQLString },
        city: { type: GraphQLString },
        notes: { type: GraphQLString },
        facebook_url: { type: GraphQLString },
        instagram_url: { type: GraphQLString },
        linkedin_url: { type: GraphQLString },
        messenger_url: { type: GraphQLString },
        whatsup_url: { type: GraphQLString },
        telegram_url: { type: GraphQLString },
        viber_url: { type: GraphQLString },
        status: { type: GraphQLString },
        start_at: { type: GraphQLString },
        end_at: { type: GraphQLString },
        created_at: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

        employee_done_payments: {
            type: new GraphQLList(EmployeeDonePaymentsType),
            resolve: async (employee: EmployeeInfoData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_done_payments
                        WHERE
                            employee_id = :employee_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        employee_id: employee.employee_id,
                        connected_account_id: employee.connected_account_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        employee_payments: {
            type: new GraphQLList(EmployeePaymentType),
            resolve: async (employee: EmployeeInfoData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_payments
                        WHERE
                            employee_id = :employee_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        employee_id: employee.employee_id,
                        connected_account_id: employee.connected_account_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        employee_worked_hours: {
            type: new GraphQLList(EmployeeWorkedHoursType),
            resolve: async (employee: EmployeeInfoData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_worked_hours
                        WHERE
                            employee_id = :employee_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        employee_id: employee.employee_id,
                        connected_account_id: employee.connected_account_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        }

    })

});




export { EmployeeInfoType };

