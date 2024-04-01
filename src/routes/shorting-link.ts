import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { createNewShortingLink } from '../lib/shorting-link.service';




export class ShortingLinkRoutes {



    public routes(server: Application) {



        server.route('/api/surl/s/create-new-url')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const surl = await createNewShortingLink.createNewLink(req.body.link);


                    return res.status(200).send({
                        code: 200,
                        type: 'new_url_generated',
                        message: 'New url generated successfully',
                        short_url: surl
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/surl/:url_id')
            .get(async (req: Request, res: Response) => {

                try {

                    const url_id = req.params.url_id.toString();

                    const result = await mysql.query(`
                    SELECT
                        url_address
                    FROM
                        url_shortener
                    WHERE
                        url_id = :url_id
                `, { url_id: url_id });


                    if (result.rowsCount === 0)
                        return utils.errorHandlingReturn({ code: 404, type: 'page_not_found', message: 'Page not found - 404 error' }, res);


                    const short_url = result.rows[0].url_address.toString();

                    res.redirect(short_url);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }



}
