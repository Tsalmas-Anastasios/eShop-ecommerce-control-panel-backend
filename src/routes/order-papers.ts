import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { orderPapersFileStorage } from '../lib/connectors/fileStorage/order-papers';
import { saveNewOrderPaperService, deleteOrderPaperService } from '../lib/order-papers.service';




export class OrderPapersRoutes {

    public routes(server: Application) {

        server.route('/api/ecommerce/store/orders/upload-paper')
            .post(utils.checkAuth, orderPapersFileStorage.diskStorage.single('file_to_upload'), async (req: Request, res: Response) => {

                try {

                    if (!req.body)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_data',
                            message: 'Missing required data to save the file',
                        }, res);


                    if (!req.body?.order_id || !req.body?.type)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_data',
                            message: 'Missing required data to save the file',
                        }, res);


                    if (req.body.type !== 'invoice' && req.body.type !== 'receipt' && req.body.type !== 'proof_of_order'
                        && req.body.type !== 'dispatch_form' && req.body.type !== 'tracking_number')
                        return utils.errorHandlingReturn({
                            code: 401,
                            type: 'wrong_type_value',
                            message: 'Wrong type value!'
                        }, res);



                    const account_id = utils.findAccountIDFromSessionObject(req);


                    const order_paper_id = await saveNewOrderPaperService.saveNewOrderPaper({
                        filename: req.file.filename,
                        order_id: req.body.order_id,
                        type: req.body.type,
                        connected_account_id: account_id,
                    });



                    return res.status(200).send({
                        code: 200,
                        type: 'file_uploaded',
                        message: 'file_uploaded_successfully',
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        destination: req.file.destination,
                        filename: req.file.filename,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        // delete a file (set as archived)
        server.route('/api/ecommerce/store/orders/upload-paper/:paper_id')
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const order_paper_id = req.params.paper_id;
                    const account_id = utils.findAccountIDFromSessionObject(req);

                    await deleteOrderPaperService.deleteOrderPaper(order_paper_id, account_id);


                    return res.status(200).send({ code: 200, type: 'file_deleted', message: 'File deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
