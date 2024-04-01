import { Request, Response, NextFunction } from 'express';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();
import { utils } from './utils.service';

import { AccountToken } from '../models';







class OpenApiCheckerMiddlewareService {

    async checkAuthToken(req: Request, res: Response, next: NextFunction) {

        const token = req.body.token || req.params.token || req.headers['x-access-token'];
        if (!token)
            return res.status(403).send({
                code: 403,
                type: 'no_token_found',
                message: 'A token is required for authentication',
            });


        const decoded_token: AccountToken = jwt.verify(token, process.env.SECRET_KEY_FOR_API_TOKEN);
        if (!decoded_token?.token_id || !decoded_token?.connected_account_id && !decoded_token?.token_value
            || !decoded_token?.products_open || !decoded_token?.product_categories_open || !decoded_token?.newsletter_open
            || !decoded_token?.cart_checkout_open)
            return res.status(400).send({
                code: 400,
                type: 'missing_data',
                message: 'Missing data from token key. Wrong token key!',
            });

        if (utils.convertToEpoch(new Date().toString()) > decoded_token.exp)
            return res.status(419).send({
                code: 419,
                type: 'token_expired',
                message: 'Token key has expired. Please generate new token and try again with the new',
            });


        const mysql_query_result = await mysql.query(`
            SELECT
                *
            FROM
                account_tokens
            WHERE
                token_id = :token_id AND
                connected_account_id = :connected_account_id AND
                token_value = :token_value AND
                products_open = :products_open AND
                product_categories_open = :product_categories_open AND
                newsletter_open = :newsletter_open AND
                cart_checkout_open = :cart_checkout_open;
        `, {
            token_id: decoded_token.token_id,
            connected_account_id: decoded_token.connected_account_id,
            token_value: decoded_token.token_value,
            products_open: decoded_token.products_open,
            product_categories_open: decoded_token.product_categories_open,
            newsletter_open: decoded_token.newsletter_open,
            cart_checkout_open: decoded_token.cart_checkout_open
        });




        for (const key in config.open_api_routes)
            if (config.open_api_routes[key].includes(req.path) && decoded_token[key])
                return next();




        return res.status(401).send({
            code: 401,
            type: 'unauthorized',
            message: 'Token key is unauthorized to have access in this system',
        });

    }

}





const openApiCheckerMiddlewareService = new OpenApiCheckerMiddlewareService();
export { openApiCheckerMiddlewareService };
