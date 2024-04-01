import { Application, Request, Response, request } from 'express';
import {
    AccountToken, AccountTokenPermissions, AccountTokenIdentifiers, AccountTokensSearchArgsGraphQLParams
} from '../models';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import * as jwt from 'jsonwebtoken';
import { mailServer } from '../lib/connectors/mailServer';

import {
    createNewCompanyAPITokenConnectionKeyService, generateTokenForAPIConnectionsService, deleteTokenForAPIConnectionsService,
    checkerTokenForAPIConnectionsService, getTokenForAPIConnectionsService
} from '../lib/company-api-connections-keys.service';





export class CompanyAPIConnectionKeyRoutes {

    public routes(server: Application) {


        server.route('/api/account/settings/api/token/n/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const token_permissions: AccountTokenPermissions = {
                        products_open: req.query?.products_open ? Number(req.query.products_open) === 1 ? true : false : true,
                        product_categories_open: req.query?.product_categories_open ? Number(req.query.product_categories_open) === 1 ? true : false : true,
                        newsletter_open: req.query?.newsletter_open ? Number(req.query.newsletter_open) === 1 ? true : false : true,
                        cart_checkout_open: req.query?.cart_checkout_open ? Number(req.query.cart_checkout_open) === 1 ? true : false : true,
                    };

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    const token_identifiers: AccountTokenIdentifiers = await createNewCompanyAPITokenConnectionKeyService.createAPIToken(
                        token_permissions,
                        account_id
                    );



                    return res.status(200).send({
                        code: 200,
                        type: 'token_generated',
                        message: 'Token generated successfully',
                        token_value: token_identifiers.token_value,
                        permissions: `${token_permissions.products_open ? `products_open,` : ``}${token_permissions.product_categories_open ? `product_categories_open,` : ``}${token_permissions.newsletter_open ? `newsletter_open,` : ``}${token_permissions.cart_checkout_open ? `cart_checkout_open,` : ``}`,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/account/settings/api/token/:token_id')
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const token_id: string = req.params?.token_id;
                    const connected_account_id = utils.findAccountIDFromSessionObject(req);


                    if (!await checkerTokenForAPIConnectionsService.tokenExists(token_id, connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'token_not_found', message: 'Token doesn\'t exist' }, res);

                    await deleteTokenForAPIConnectionsService.deleteTokenForAPIConnectionsService(token_id, connected_account_id);


                    return res.status(200).send({ code: 200, type: 'token_deleted', message: 'Token deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const token_id: string = req.params?.token_id;
                    const connected_account_id = utils.findAccountIDFromSessionObject(req);


                    const token: AccountToken = await getTokenForAPIConnectionsService.getSpecificToken(
                        {
                            token_id: token_id,
                            connected_account_id: connected_account_id
                        },
                        req
                    );


                    return res.status(200).send(token);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/account/settings/api/token/l/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const token_list: AccountToken[] = await getTokenForAPIConnectionsService.getList(
                        { connected_account_id: utils.findAccountIDFromSessionObject(req) },
                        req
                    );

                    return res.status(200).send(token_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });

    }

}
