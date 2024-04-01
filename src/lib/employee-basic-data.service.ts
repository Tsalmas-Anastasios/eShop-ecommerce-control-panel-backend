import { Request } from 'express';
import {
    EmployeeInfoData, EmployeeInfoSearchParamsArgs
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';


import { employeeIDNumbersGenerator } from './id_numbers_generators/employees';





class EmployeesListGETService {


    async getList(params?: EmployeeInfoSearchParamsArgs, req?: Request): Promise<EmployeeInfoData[]> {

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
                        employeeInfo${graphQueryParams !== '()' ? graphQueryParams : ''}{

                            employee_id
                            first_name
                            middle_name
                            last_name
                            fathers_name
                            mothers_name
                            mother_last_name
                            tax_id
                            social_security_number_amka
                            date_of_birth
                            date_of_birth_epoch
                            company
                            position
                            phone_number
                            work_phone_number
                            home_phone_number
                            other_phone_number
                            email
                            work_email
                            other_email
                            address
                            postal_code
                            city
                            notes
                            facebook_url
                            instagram_url
                            linkedin_url
                            messenger_url
                            whatsup_url
                            telegram_url
                            viber_url
                            status
                            start_at
                            end_at
                            created_at

                            employee_done_payments{
                                rec_id
                                payment_version_id
                                payment_date_time
                                status
                            }

                            employee_payments{
                                rec_id
                                version_label
                                hourly_payment
                                payment_frequency
                                hours_per_day
                                initial_payment
                                active
                            }

                            employee_worked_hours{
                                rec_id
                                date_day
                                start_time
                                end_time
                                status
                            }

                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const employees: EmployeeInfoData[] = result.data.employeeInfo as EmployeeInfoData[];

            return Promise.resolve(employees);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getEmployeeData(params: EmployeeInfoSearchParamsArgs, req?: Request): Promise<EmployeeInfoData> {

        try {

            const employees: EmployeeInfoData[] = await this.getList(params, req || null);
            if (employees.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(employees[0] as EmployeeInfoData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class EmployeeCheckerService {


    async employeeExists(data: { employee_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    employee_id
                FROM
                    employee_info
                WHERE
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
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




class EmployeeUpdateService {


    async updateEmployeeData(data: EmployeeInfoData, identifiers: { employee_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    employee_info
                SET
                    ${data?.first_name && data?.first_name !== null ? `first_name = '${data.first_name}',` : ``}
                    ${data?.middle_name && data?.middle_name !== null ? `middle_name = '${data.middle_name}',` : ``}
                    ${data?.last_name && data?.last_name !== null ? `last_name = '${data.last_name}',` : ``}
                    ${data?.fathers_name && data?.fathers_name !== null ? `fathers_name = '${data.fathers_name}',` : ``}
                    ${data?.mothers_name && data?.mothers_name !== null ? `mothers_name = '${data.mothers_name}',` : ``}
                    ${data?.mother_last_name && data?.mother_last_name !== null ? `mother_last_name = '${data.mother_last_name}',` : ``}
                    ${data?.tax_id && data?.tax_id !== null ? `tax_id = '${data.tax_id}',` : ``}
                    ${data?.social_security_number_amka && data?.social_security_number_amka !== null ? `social_security_number_amka = '${data.social_security_number_amka}',` : ``}
                    ${data?.date_of_birth && data?.date_of_birth !== null ? `date_of_birth = '${data.date_of_birth}',` : ``}
                    ${data?.date_of_birth_epoch && data?.date_of_birth_epoch !== null ? `date_of_birth_epoch = '${data.date_of_birth_epoch}',` : ``}
                    ${data?.company && data?.company !== null ? `company = '${data.company}',` : ``}
                    ${data?.position && data?.position !== null ? `position = '${data.position}',` : ``}
                    ${data?.phone_number && data?.phone_number !== null ? `phone_number = '${data.phone_number}',` : ``}
                    ${data?.work_phone_number && data?.work_phone_number !== null ? `work_phone_number = '${data.work_phone_number}',` : ``}
                    ${data?.home_phone_number && data?.home_phone_number !== null ? `home_phone_number = '${data.home_phone_number}',` : ``}
                    ${data?.other_phone_number && data?.other_phone_number !== null ? `other_phone_number = '${data.other_phone_number}',` : ``}
                    ${data?.email && data?.email !== null ? `email = '${data.email}',` : ``}
                    ${data?.work_email && data?.work_email !== null ? `work_email = '${data.work_email}',` : ``}
                    ${data?.other_email && data?.other_email !== null ? `other_email = '${data.other_email}',` : ``}
                    ${data?.address && data?.address !== null ? `address = '${data.address}',` : ``}
                    ${data?.postal_code && data?.postal_code !== null ? `postal_code = '${data.postal_code}',` : ``}
                    ${data?.city && data?.city !== null ? `city = '${data.city}',` : ``}
                    ${data?.notes && data?.notes !== null ? `notes = '${data.notes}',` : ``}
                    ${data?.facebook_url && data?.facebook_url !== null ? `facebook_url = '${data.facebook_url}',` : ``}
                    ${data?.instagram_url && data?.instagram_url !== null ? `instagram_url = '${data.instagram_url}',` : ``}
                    ${data?.linkedin_url && data?.linkedin_url !== null ? `linkedin_url = '${data.linkedin_url}',` : ``}
                    ${data?.messenger_url && data?.messenger_url !== null ? `messenger_url = '${data.messenger_url}',` : ``}
                    ${data?.whatsup_url && data?.whatsup_url !== null ? `whatsup_url = '${data.whatsup_url}',` : ``}
                    ${data?.telegram_url && data?.telegram_url !== null ? `telegram_url = '${data.telegram_url}',` : ``}
                    ${data?.viber_url && data?.viber_url !== null ? `viber_url = '${data.viber_url}',` : ``}
                    ${data?.status && data?.status !== null ? `status = '${data.status}',` : ``}
                    ${data?.start_at && data?.start_at !== null ? `start_at = '${data.start_at}',` : ``}
                    ${data?.end_at && data?.end_at !== null ? `end_at = '${data.end_at}',` : ``}
                    connected_account_id = :connected_account_id
                WHERE
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                employee_id: identifiers.employee_id,
                connected_account_id: identifiers.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class EmployeesDeleteService {


    async deleteEmployee(identifiers: { employee_id: string, connected_account_id: string }, delete_status: 'fired' | 'resigned' | string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    employee_payments
                SET
                    status = :status
                WHERE
                    employee_id = :employee_id AND
                    connected_account_id = :connected_account_id
            `, {
                status: delete_status,
                employee_id: identifiers.employee_id,
                connected_account_id: identifiers.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class EmployeeInsertService {


    async addNewEmployee(data: EmployeeInfoData, connected_account_id: string): Promise<string> {

        try {

            const employee_id = employeeIDNumbersGenerator.getEmployeeID();
            const result = await mysql.query(`
                INSERT INTO
                    employee_info
                SET
                    employee_id = :employee_id,
                    first_name = :first_name,
                    ${data?.middle_name && data?.middle_name !== null ? `middle_name = '${data.middle_name}',` : ``}
                    last_name = :last_name,
                    fathers_name = :fathers_name,
                    mothers_name = :mothers_name,
                    mother_last_name = :mother_last_name,
                    tax_id = :tax_id,
                    social_security_number_amka = :social_security_amka,
                    date_of_birth = :date_of_birth,
                    date_of_birth_epoch = :date_of_birth_epoch,
                    company = :company,
                    position = :position,
                    phone_number = :phone_number,
                    ${data?.work_phone_number && data?.work_phone_number !== null ? `work_phone_number = '${data.work_phone_number}',` : ``}
                    ${data?.home_phone_number && data?.home_phone_number !== null ? `home_phone_number = '${data.home_phone_number}',` : ``}
                    ${data?.other_phone_number && data?.other_phone_number !== null ? `other_phone_number = '${data.other_phone_number}',` : ``}
                    email = :email,
                    ${data?.work_email && data?.work_email !== null ? `work_email = '${data.work_email}',` : ``}
                    ${data?.other_email && data?.other_email !== null ? `other_email = '${data.other_email}',` : ``}
                    address = :address,
                    postal_code = :postal_code,
                    city = :city,
                    ${data?.notes && data?.notes !== null ? `notes = '${data.notes}',` : ``}
                    ${data?.facebook_url && data?.facebook_url !== null ? `facebook_url = '${data.facebook_url}',` : ``}
                    ${data?.instagram_url && data?.instagram_url !== null ? `instagram_url = '${data.instagram_url}',` : ``}
                    ${data?.linkedin_url && data?.linkedin_url !== null ? `linkedin_url = '${data.linkedin_url}',` : ``}
                    ${data?.messenger_url && data?.messenger_url !== null ? `messenger_url = '${data.messenger_url}',` : ``}
                    ${data?.whatsup_url && data?.whatsup_url !== null ? `whatsup_url = '${data.whatsup_url}',` : ``}
                    ${data?.telegram_url && data?.telegram_url !== null ? `telegram_url = '${data.telegram_url}',` : ``}
                    ${data?.viber_url && data?.viber_url !== null ? `viber_url = '${data.viber_url}',` : ``}
                    status = :status,
                    start_at = :start_at,
                    connected_account_id = :connected_account_id
            `, {
                employee_id: employee_id,
                first_name: data.first_name,
                last_name: data.last_name,
                fathers_ame: data.fathers_name,
                mothers_name: data.mothers_name,
                mother_last_name: data.mother_last_name,
                tax_id: data.tax_id,
                social_security_amka: data.social_security_number_amka,
                date_of_birth: data.date_of_birth,
                date_of_birth_epoch: utils.convertToEpoch(data.date_of_birth as string),
                company: data.company,
                position: data.position,
                phone_number: data.phone_number,
                email: data.email,
                address: data.address,
                postal_code: data.postal_code,
                city: data.city,
                status: data.status,
                start_at: data.start_at,
                connected_account_id: connected_account_id,
            });


            return Promise.resolve(employee_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}








const employeesListGETService = new EmployeesListGETService();
const employeeCheckerService = new EmployeeCheckerService();
const employeeUpdateService = new EmployeeUpdateService();
const employeesDeleteService = new EmployeesDeleteService();
const employeeInsertService = new EmployeeInsertService();
export {
    employeesListGETService, employeeCheckerService, employeeUpdateService,
    employeesDeleteService, employeeInsertService
};
