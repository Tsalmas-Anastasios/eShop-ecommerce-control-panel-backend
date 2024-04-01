import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import {
    contactLabelsNamesListService, updateContactLabelNameService, deleteCOntactLabelNameService,
    insertNewContactLabelsNameService
} from '../lib/contact-labels-names.service';
import { contactsListService } from '../lib/contact.service';
import { Contact, ContactLabel, ContactSearchDataArgs, ContactLabelName } from '../models';





export class ContactLabelsNamesRoutes {

    public routes(server: Application) {


        server.route('/api/manage/contacts/labels/names/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const labels: ContactLabelName[] = await contactLabelsNamesListService.getList({
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    }, req);


                    return res.status(200).send(labels);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/contacts/labels/names/:label_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const label: ContactLabelName = await contactLabelsNamesListService.getLabel({
                        label_id: req.params.label_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    });


                    return res.status(200).send(label);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.body?.label)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to update' }, res);

                    const data = {
                        label_id: req.params.label_id,
                        label: req.body.label,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await contactLabelsNamesListService.labelExists(data.label_id, data.connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'label_not_found', message: 'Label doesn\'t exist in current account' }, res);


                    await updateContactLabelNameService.updateLabel(data);


                    return res.status(200).send({ code: 200, type: 'label_updated', message: 'Label updated successfully!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data = {
                        label_id: req.params.label_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    if (!await contactLabelsNamesListService.labelExists(data.label_id, data.connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'label_not_found', message: 'Label doesn\'t exist in current account' }, res);


                    await deleteCOntactLabelNameService.deleteLabel(data);

                    return res.status(200).send({ code: 200, type: 'label_deleted', message: 'Label deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


        server.route('/api/manage/contacts/labels/names/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.body?.label)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to post' }, res);


                    const label_id = await insertNewContactLabelsNameService.addNewLabel({
                        label: req.body.label,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    });


                    if (label_id === null)
                        return utils.errorHandlingReturn({ code: 401, type: 'label_already_exists' }, res);


                    return res.status(200).send({
                        code: 200,
                        type: 'label_inserted',
                        message: 'Label inserted successfully',
                        label_id: label_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }

}

