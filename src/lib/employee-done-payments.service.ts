import { Request } from 'express';
import {
    EmployeeDonePayments, EmployeeDonePaymentsSearchArgsGraphQLParams
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';


import { employeeIDNumbersGenerator } from './id_numbers_generators/employees';





class EmployeeDonePaymentsListService {


    async getList(params: EmployeeDonePaymentsSearchArgsGraphQLParams, req?: Request): Promise<EmployeeDonePayments[]> {

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
                        employeeDonePayments${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            payment_version_id
                            payment_date_time
                            status
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const employee_done_payments: EmployeeDonePayments[] = result.data.employeeDonePayments as EmployeeDonePayments[];

            return Promise.resolve(employee_done_payments);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getOnePayment(params?: EmployeeDonePaymentsSearchArgsGraphQLParams, req?: Request): Promise<EmployeeDonePayments> {

        try {

            const employee_done_payments: EmployeeDonePayments[] = await this.getList(params, req || null);
            if (employee_done_payments.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(employee_done_payments[0] as EmployeeDonePayments);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeeDonePaymentsCheckerService {


    async donePaymentExists(data: {
        rec_id: string,
        employee_id: string,
        connected_account_id: string,
    }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    employee_done_payments
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






class EmployeeDonePaymentsUpdateService {


    async updateDonePayment(data: EmployeeDonePayments): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    employee_done_payments
                SET
                    ${data?.payment_version_id && data?.payment_version_id !== null ? `payment_version_id = '${data?.payment_version_id}',` : ``}
                    ${data?.payment_date_time && data?.payment_date_time !== null ? `payment_date_time = '${data?.payment_date_time}',` : ``}
                    ${data?.status && data?.status !== null ? `status = '${data?.status}',` : ``}
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



class EmployeeDonePaymentDeleteService {


    async deleteDonePayment(data: {
        rec_id: string,
        employee_id: string,
        connected_account_id: string,
    }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    employee_done_payments
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





class EmployeeDonePaymentsInsertNewSearch {


    async insertNewDonePayment(data: EmployeeDonePayments): Promise<string> {

        try {

            const rec_id = employeeIDNumbersGenerator.getEmployeeDonePaymentID();
            const result = await mysql.query(`
                INSERT INTO
                    employee_done_payments
                SET
                    rec_id = :rec_id,
                    employee_id = :employee_id,
                    connected_account_id = :connected_account_id,
                    payment_version_id = :payment_version_id
            `, {
                rec_id: data.rec_id,
                employee_id: data.employee_id,
                connected_account_id: data.connected_account_id,
                payment_version_id: data.payment_version_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}











const employeeDonePaymentsListService = new EmployeeDonePaymentsListService();
const employeeDonePaymentsCheckerService = new EmployeeDonePaymentsCheckerService();
const employeeDonePaymentsUpdateService = new EmployeeDonePaymentsUpdateService();
const employeeDonePaymentDeleteService = new EmployeeDonePaymentDeleteService();
const employeeDonePaymentsInsertNewSearch = new EmployeeDonePaymentsInsertNewSearch();
export {
    employeeDonePaymentsListService, employeeDonePaymentsCheckerService,
    employeeDonePaymentsUpdateService, employeeDonePaymentDeleteService,
    employeeDonePaymentsInsertNewSearch
};
