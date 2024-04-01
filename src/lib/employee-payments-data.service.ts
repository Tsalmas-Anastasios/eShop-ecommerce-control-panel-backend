import { Request } from 'express';
import {
    EmployeePayments, EmployeePaymentsSearchArgsGraphQLParams
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';


import { employeeIDNumbersGenerator } from './id_numbers_generators/employees';




class EmployeePaymentsDataListService {


    async getList(params?: EmployeePaymentsSearchArgsGraphQLParams, req?: Request): Promise<EmployeePayments[]> {

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
                        employeePayments${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            version_label
                            hourly_payment
                            payment_frequency
                            hours_per_day
                            initial_payment_date
                            active
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const employee_payments: EmployeePayments[] = result.data.employeePayments as EmployeePayments[];

            return Promise.resolve(employee_payments);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getEmployeePaymentOne(params: EmployeePaymentsSearchArgsGraphQLParams, req?: Request): Promise<EmployeePayments> {

        try {

            const employee_payments: EmployeePayments[] = await this.getList(params, req || null);
            if (employee_payments.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(employee_payments[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeePaymentsDataCheckerService {


    async paymentExists(data: {
        employee_id: string,
        connected_account_id: string,
        payment_id: string
    }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    employee_payments
                WHERE
                    rec_id = :rec_id,
                    connected_account_id = :connected_account_id,
                    employee_id = :employee_id
            `, {
                rec_id: data.payment_id,
                connected_account_id: data.connected_account_id,
                employee_id: data.employee_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeePaymentsDataUpdateService {


    async updatePaymentVersion(
        data: EmployeePayments,
        identifiers: {
            employee_id: string,
            connected_account_id: string,
            payment_id: string,
        }
    ): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    employee_payments
                SET
                    ${data?.version_label && data?.version_label !== null ? `version_label = '${data.version_label}',` : ``}
                    ${data?.hourly_payment && data?.hourly_payment !== null ? `hourly_payment = '${data.hourly_payment}',` : ``}
                    ${data?.payment_frequency && data?.payment_frequency !== null ? `payment_frequency = '${data.payment_frequency}',` : ``}
                    ${data?.hours_per_day && data?.hours_per_day !== null ? `hours_per_day = '${data.hours_per_day}',` : ``}
                    ${data?.initial_payment_date && data?.initial_payment_date !== null ? `initial_payment_date = '${data.initial_payment_date}',` : ``}
                    ${data?.active && data?.active !== null ? `active = ${data.active ? 1 : 0},` : ``}
                    connected_account_id = :connected_account_id
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    employee_id = :employee_id
            `, {
                rec_id: identifiers.payment_id,
                connected_account_id: identifiers.connected_account_id,
                employee_id: identifiers.employee_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async updateActiveStatus(identifiers: {
        employee_id: string,
        connected_account_id: string,
        payment_id: string,
    }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE FROM
                    employee_payments
                SET
                    active = 0
                WHERE
                    rec_id <> :rec_id AND
                    connected_account_id = :connected_account_id AND
                    employee_id = :employee_id
            `, {
                rec_id: identifiers.payment_id,
                connected_account_id: identifiers.connected_account_id,
                employee_id: identifiers.employee_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class EmployeePaymentsDataDeleteService {


    async deleteVersion(identifiers: { employee_id: string, connected_account_id: string, payment_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    employee_payments
                WHERE
                    rec_id = :rec_id AND
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: identifiers.payment_id,
                employee_id: identifiers.employee_id,
                connected_account_id: identifiers.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeePaymentsDataInsertService {


    async addNewPaymentVersion(data: EmployeePayments, identifiers: { employee_id: string, connected_account_id: string }): Promise<string> {

        try {

            const rec_id = employeeIDNumbersGenerator.getEmployeePaymentsID();
            const result = await mysql.query(`
                INSERT INTO
                    employee_payments
                SET
                    rec_id = :rec_id,
                    employee_id = :employee_id,
                    connected_account_id = :connected_account_id,
                    version_label = :version_label,
                    hourly_payment = :hourly_payment,
                    payment_frequency = :payment_frequency,
                    hours_per_day = :hours_per_day,
                    initial_payment_date = :initial_payment_date,
                    active = :active
            `, {
                rec_id: rec_id,
                employee_id: identifiers.employee_id,
                connected_account_id: identifiers.connected_account_id,
                version_label: data.version_label,
                hourly_payment: data.hourly_payment,
                payment_frequency: data.payment_frequency,
                hours_per_day: data.hours_per_day,
                initial_payment_date: data.initial_payment_date,
                active: data.active ? 1 : 0,
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}









const employeePaymentsDataListService = new EmployeePaymentsDataListService();
const employeePaymentsDataCheckerService = new EmployeePaymentsDataCheckerService();
const employeePaymentsDataUpdateService = new EmployeePaymentsDataUpdateService();
const employeePaymentsDataDeleteService = new EmployeePaymentsDataDeleteService();
const employeePaymentsDataInsertService = new EmployeePaymentsDataInsertService();
export {
    employeePaymentsDataListService, employeePaymentsDataCheckerService, employeePaymentsDataUpdateService,
    employeePaymentsDataDeleteService, employeePaymentsDataInsertService
};
