import { Request } from 'express';
import {
    EmployeeWorkedHours, EmployeeWorkedHoursSearchArgsParamsGraphQL
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';


import { employeeIDNumbersGenerator } from './id_numbers_generators/employees';







class EmployeeWorkedHoursListService {

    async getList(params?: EmployeeWorkedHoursSearchArgsParamsGraphQL, req?: Request): Promise<EmployeeWorkedHours[]> {

        try {

            let graphQueryParams = '';

            if (params && !utils.lodash.isEmpty(params)) {

                graphQueryParams += '(';

                // tslint:disable-next-line:curly
                let i = 0;
                for (const key in params) {
                    if (i > 0)
                        graphQueryParams += ',';

                    if (typeof params[key] === 'number')
                        graphQueryParams += `${key}: ${params[key]}`;
                    else
                        graphQueryParams += `${key}: "${params[key]}"`;

                    i++;

                }

                graphQueryParams += ')';

            }



            const result = await graphql({
                schema: schema,
                source: `
                    {
                        employeeWorkedHours${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            date_day
                            start_time
                            end_time
                            status
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const employee_worked_hours: EmployeeWorkedHours[] = result.data.employeeWorkedHours as EmployeeWorkedHours[];

            return Promise.resolve(employee_worked_hours);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getWorkedHour(params: EmployeeWorkedHoursSearchArgsParamsGraphQL, req?: Request): Promise<EmployeeWorkedHours> {

        try {

            const employee_worked_hours: EmployeeWorkedHours[] = await this.getList(params, req || null);
            if (employee_worked_hours.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(employee_worked_hours[0] as EmployeeWorkedHours);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class EmployeeWorkedHoursCheckerService {


    async hoursExist(data: {
        rec_id: string,
        employee_id: string,
        connected_account_id: string,
    }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    employee_worked_hours
                WHERE
                    rec_id = :rec_id AND
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.rec_id,
                employee_id: data.employee_id,
                connected_account_id: data.connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeeWorkedHoursUpdateService {


    async updateWorkHours(data: EmployeeWorkedHours): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    employee_worked_hours
                SET
                    ${data?.date_day && data?.date_day !== null ? `date_day = '${data.date_day}',` : ``}
                    ${data?.start_time && data?.start_time !== null ? `start_time = '${data.start_time}',` : ``}
                    ${data?.end_time && data?.end_time !== null ? `end_time = '${data.end_time}',` : ``}
                    ${data?.status && data?.status !== null ? `status = '${data.status}',` : ``}
                    rec_id = :rec_id
                WHERE
                    rec_id = :rec_id AND
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.rec_id,
                employee_id: data.employee_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class EmployeeWorkedHoursDeleteService {


    async deleteRecord(data: {
        rec_id: string,
        employee_id: string,
        connected_account_id: string,
    }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    employee_worked_hours
                WHERE
                    rec_id = :rec_id AND
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.rec_id,
                employee_id: data.employee_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeeWorkedHoursInsertNewService {


    async insertNewDate(data: EmployeeWorkedHours): Promise<string> {

        try {

            const rec_id = employeeIDNumbersGenerator.getEmployeeWorkedHoursID();
            const result = await mysql.query(`
                INSERT INTO
                    employee_worked_hours
                SET
                    rec_id = :rec_id,
                    employee_id = :employee_id,
                    connected_account_id = :connected_account_id,
                    date_day = :date_day,
                    start_time = :start_time,
                    end_time = :end_time
                    ${data?.status && data?.status !== null ? `, status = '${data.status}',` : ``}
            `, {
                rec_id: rec_id,
                employee_id: data.employee_id,
                connected_account_id: data.connected_account_id,
                date_day: data.date_day,
                start_time: data.start_time,
                end_time: data.end_time
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}









const employeeWorkedHoursListService = new EmployeeWorkedHoursListService();
const employeeWorkedHoursCheckerService = new EmployeeWorkedHoursCheckerService();
const employeeWorkedHoursUpdateService = new EmployeeWorkedHoursUpdateService();
const employeeWorkedHoursDeleteService = new EmployeeWorkedHoursDeleteService();
const employeeWorkedHoursInsertNewService = new EmployeeWorkedHoursInsertNewService();
export {
    employeeWorkedHoursListService, employeeWorkedHoursCheckerService,
    employeeWorkedHoursUpdateService, employeeWorkedHoursDeleteService,
    employeeWorkedHoursInsertNewService
};
