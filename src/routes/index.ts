import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { config, emailServer } from '../config';
import { mailServer } from '../lib/connectors/mailServer';



export class IndexRoutes {

    public routes(server: Application): void {


        server.route('/')
            .get(async (req: Request, res: Response) => {

                return res.status(200).send({ message: 'Hi, you are unauthorized to have access in this system!' });

            });



        server.route('/api/protected')
            .get(utils.checkAuth, (req: Request, res: Response) => {

                return res.status(200).send({
                    message: `Hi ${req.session.user.first_name} ${req.session.user.last_name}, enjoy your sales with Bizyhive e-Commerce Control Panel!`,
                    session_data: req.session.user,
                });

            });


    }

}
