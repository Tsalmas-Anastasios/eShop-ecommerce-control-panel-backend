import { Application, Request, Response } from 'express';
import { utils } from '../../lib/utils.service';



export class DocumentationRoutes {

    public routes(server: Application): void {


        server.route('/documentation/backend')
            .get(async (req: Request, res: Response) => {

                // const htmlFile_data = utils.fs.readFileSync(utils.path.join(__dirname, '/documentation.html'), 'utf8');

                // return res.sendFile(htmlFile_data.replace('documentationYamlFile', utils.path.join(__dirname, '/bundle.yaml')));


                utils.fs.readFile(utils.path.join(__dirname, '/documentation.html'), 'utf8', (error, html) => {

                    if (error)
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);


                    const modifiedHtml = html.replace('documentationYamlFile', 'https://control-panel.bizyhive.com/routes/documentation/bundle.yaml');


                    res.send(modifiedHtml);

                });


                // res.sendFile(utils.path.join(__dirname, 'bundle.yaml'));

            });


    }

}
