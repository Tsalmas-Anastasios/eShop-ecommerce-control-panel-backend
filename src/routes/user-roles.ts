import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { profilePictureFileStorage } from '../lib/connectors/fileStorage/profile-picture';
import { userGetDataService } from '../lib/user.service';
import { SessionDataObject } from '../models';
import { authChecksGeneral } from '../lib/account.service';
require('dotenv').config();





export class UserRolesRoutes {


    public routes(server: Application) {


        server.route('/api/users/roles/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
