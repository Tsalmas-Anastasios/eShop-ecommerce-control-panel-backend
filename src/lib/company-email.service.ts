import { Request } from 'express';
import {
    CompanyEmailData, CompanyEmailSearchDataArgsGraphQL
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { companyEmailIDGeneratorService } from './id_numbers_generators/company-email';




class AddNewCompanyEmailService {


    async addNewCompanyEmail(data: CompanyEmailData): Promise<string> {

        try {

            const rec_id = companyEmailIDGeneratorService.getCompanyEmailID();
            const result = await mysql.query(`
                INSERT INTO
                    company_email_data
                SET
                    email_id = :email_id,
                    connected_account_id = :connected_account_id,
                    email_label = :email_label,
                    host = :host,
                    port = :port,
                    secure = :secure,
                    user = :user,
                    password = :password,
                    default_name = :default_name,
                    default_email = :default_email
            `, {
                email_id: rec_id,
                connected_account_id: data.connected_account_id,
                email_label: data.email_label,
                host: data.host,
                port: data.port,
                secure: data.secure,
                user: data.user,
                password: data.password,
                default_name: data.default_name,
                default_email: data.default_email,
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class GetCompanyEmailService {


    async getList(params?: CompanyEmailSearchDataArgsGraphQL, req?: Request): Promise<CompanyEmailData[]> {

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
                        companyEmails${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            email_id
                            email_label
                            host
                            port
                            secure
                            user
                            password
                            default_name
                            default_email
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const email_list: CompanyEmailData[] = result.data.companyEmails as CompanyEmailData[];
            return Promise.resolve(email_list);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificEmail(params: CompanyEmailSearchDataArgsGraphQL, req?: Request): Promise<CompanyEmailData> {

        try {

            const email_list: CompanyEmailData[] = await this.getList(params, req || null);
            if (email_list.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(email_list[0] as CompanyEmailData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CheckerCompanyEmailService {


    async companyEmailExists(params?: CompanyEmailSearchDataArgsGraphQL): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    email_id
                FROM
                    company_email_data
                WHERE
                    email_id = :email_id AND
                    connected_account_id = :connected_account_id
            `, {
                email_id: params.email_id,
                connected_account_id: params.connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class UpdateCompanyEmailService {


    async updateCompanyEmail(data: CompanyEmailData): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    company_email_data
                SET
                    ${data?.email_label && data.email_label ? `email_label = "${data.email_label}",` : ``}
                    ${data?.host && data.host ? `host = "${data.host}",` : ``}
                    ${data?.port && data.port ? `port = "${data.port}",` : ``}
                    ${data?.secure && data.secure ? `secure = ${data.secure ? 1 : 0},` : ``}
                    ${data?.user && data.user ? `user = "${data.user}",` : ``}
                    ${data?.password && data.password ? `password = "${data.password}",` : ``}
                    ${data?.default_name && data.default_name ? `default_name = "${data.default_name}",` : ``}
                    ${data?.default_email && data.default_email ? `default_email = "${data.default_email}",` : ``}
                    email_id = :email_id
                WHERE
                    email_id = :email_id AND
                    connected_account_id = :connected_account_id
            `, {
                email_id: data.email_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }

    }


}





class DeleteCompanyEmailService {


    async deleteCompanyEmailService(data: CompanyEmailSearchDataArgsGraphQL): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    company_email_data
                WHERE
                    email_id = :email_id AND
                    connected_account_id = :connected_account_id
            `, {
                email_id: data.email_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}











const addNewCompanyEmailService = new AddNewCompanyEmailService();
const getCompanyEmailService = new GetCompanyEmailService();
const checkerCompanyEmailService = new CheckerCompanyEmailService();
const updateCompanyEmailService = new UpdateCompanyEmailService();
const deleteCompanyEmailService = new DeleteCompanyEmailService();
export {
    addNewCompanyEmailService, getCompanyEmailService, checkerCompanyEmailService,
    updateCompanyEmailService, deleteCompanyEmailService
};
