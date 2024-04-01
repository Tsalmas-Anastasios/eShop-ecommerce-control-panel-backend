import { Request } from 'express';
import {
    AccountToken, AccountTokenPermissions, AccountTokenIdentifiers, AccountTokensSearchArgsGraphQLParams
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { companyAPIConnectionsKeysIDGeneratorService } from './id_numbers_generators/company-api-connections-key';








class CreateNewCompanyAPITokenConnectionKeyService {


    async createAPIToken(token_permissions: AccountTokenPermissions, connected_account_id: string): Promise<AccountTokenIdentifiers> {

        try {

            const temp_token_id = companyAPIConnectionsKeysIDGeneratorService.getAPITokenID();
            const identifiers: AccountTokenIdentifiers = {
                token_id: temp_token_id,
                token_value: generateTokenForAPIConnectionsService.createToken(token_permissions, temp_token_id, connected_account_id),
            };


            const result = await mysql.query(`
                INSERT INTO
                    account_tokens
                SET
                    token_id = :token_id,
                    connected_account_id = :connected_account_id,
                    token_value = :token_value,
                    products_open = :products_open,
                    product_categories_open = :product_categories_open,
                    newsletter_open = :newsletter_open,
                    cart_checkout_open = :cart_checkout_open
            `, {
                token_id: identifiers.token_id,
                connected_account_id: connected_account_id,
                token_value: identifiers.token_value,
                products_open: token_permissions.products_open ? 1 : 0,
                product_categories_open: token_permissions.product_categories_open ? 1 : 0,
                newsletter_open: token_permissions.newsletter_open ? 1 : 0,
                cart_checkout_open: token_permissions.cart_checkout_open ? 1 : 0,
            });


            return Promise.resolve(identifiers);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class GenerateTokenForAPIConnectionsService {


    createToken(token_permissions: AccountTokenPermissions, token_id: string, connected_account_id: string): string {

        try {

            return jwt.sign(
                {
                    token_id: token_id,
                    connected_account_id: connected_account_id,
                    products_open: token_permissions.products_open,
                    product_categories_open: token_permissions.product_categories_open,
                    newsletter_open: token_permissions.newsletter_open,
                    cart_checkout_open: token_permissions.cart_checkout_open
                },
                config.SECRET_KEY_FOR_API_TOKEN,
                { expiresIn: '1 year' },
            );

        } catch (error) {
            return error;
        }

    }


}




class DeleteTokenForAPIConnectionsService {


    async deleteTokenForAPIConnectionsService(token_id: string, connected_account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    account_tokens
                WHERE
                    token_id = :token_id AND
                    connected_account_id = :connected_account_id
            `, {
                token_id: token_id,
                connected_account_id: connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CheckerTokenForAPIConnectionsService {


    async tokenExists(token_id: string, connected_account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    token_id
                FROM
                    account_tokens
                WHERE
                    token_id = :token_id AND
                    connected_account_id = :connected_account_id
            `, {
                token_id: token_id,
                connected_account_id: connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class GetTokenForAPIConnectionsService {


    async getList(params?: AccountTokensSearchArgsGraphQLParams, req?: Request): Promise<AccountToken[]> {

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
                        companyAPIConnectionsKeys${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            token_id
                            token_value
                            created_at
                            products_open
                            product_categories_open
                            newsletter_open
                            cart_checkout_open
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const token_list: AccountToken[] = result.data.companyAPIConnectionsKeys as AccountToken[];

            return Promise.resolve(token_list);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificToken(params: AccountTokensSearchArgsGraphQLParams, req?: Request): Promise<AccountToken> {

        try {

            const token_list: AccountToken[] = await this.getList(params, req || null);
            if (token_list.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(token_list[0] as AccountToken);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}














const createNewCompanyAPITokenConnectionKeyService = new CreateNewCompanyAPITokenConnectionKeyService();
const generateTokenForAPIConnectionsService = new GenerateTokenForAPIConnectionsService();
const deleteTokenForAPIConnectionsService = new DeleteTokenForAPIConnectionsService();
const checkerTokenForAPIConnectionsService = new CheckerTokenForAPIConnectionsService();
const getTokenForAPIConnectionsService = new GetTokenForAPIConnectionsService();
export {
    createNewCompanyAPITokenConnectionKeyService, generateTokenForAPIConnectionsService, deleteTokenForAPIConnectionsService,
    checkerTokenForAPIConnectionsService, getTokenForAPIConnectionsService
};

