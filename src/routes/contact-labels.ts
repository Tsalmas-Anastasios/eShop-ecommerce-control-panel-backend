import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import {
    contactLabelsList, updateContactLabelService, deleteContactLabelService, addNewContactLabelService
} from '../lib/contact-labels.service';
import { contactsListService, contactsCheckerService } from '../lib/contact.service';
import { Contact, ContactLabel, ContactSearchDataArgs } from '../models';






export class ContactLabelsRoutes {

    public routes(server: Application) {


        server.route('/api/manage/contacts/:contact_id/labels/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const contact_id = req.params.contact_id;

                    if (!contactsCheckerService.contactExists({ contact_id: contact_id, connected_account_id: account_id }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact id doesn\'t exist' }, res);

                    const labels: ContactLabel[] = await contactLabelsList.getList({
                        connected_account_id: account_id,
                        contact_id: contact_id
                    }, req);

                    return res.status(200).send(labels);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        server.route('/api/manage/contacts/:contact_id/labels/:label_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    if (!contactsCheckerService.contactExists({ contact_id: req.params.contact_id, connected_account_id: account_id }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact id doesn\'t exist' }, res);

                    const label: ContactLabel = await contactLabelsList.getSpecificLabel({
                        label_id: req.params.label_id,
                        connected_account_id: account_id,
                        contact_id: req.params.contact_id
                    });



                    return res.status(200).send(label);



                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    const data: ContactLabel = req.body;
                    if (!data?.label_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_credentials', message: 'Can not update the label! Missing data!' }, res);


                    data.rec_id = req.params.rec_id;
                    data.contact_id = req.params.contact_id;
                    data.connected_account_id = account_id;

                    if (!await contactsListService.contactExists(data.contact_id, data.connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact not found!' }, res);


                    await updateContactLabelService.updateContactLabel(data);


                    return res.status(200).send({ code: 200, type: 'contact_label_updated', message: 'Contact label successfully updated!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data = {
                        rec_id: req.params.label_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };

                    if (!contactsCheckerService.contactExists({ contact_id: data.contact_id, connected_account_id: data.connected_account_id }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact id doesn\'t exist' }, res);



                    await deleteContactLabelService.deleteContactLabel(data);


                    return res.status(200).send({ code: 200, type: 'label_deleted', message: 'Label removed successfully from the contact' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/manage/contacts/:contact_id/labels/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.body?.label_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'no_data_found', message: 'No data found to save the new label' }, res);

                    const data: ContactLabel = {
                        label_id: req.body.label_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };


                    if (!contactsCheckerService.contactExists({ contact_id: data.contact_id, connected_account_id: data.connected_account_id }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact id doesn\'t exist' }, res);


                    const rec_id = addNewContactLabelService.addNewContactLabel(data);

                    return res.status(200).send({
                        code: 200,
                        type: 'contact_label_added',
                        message: `Contact label added successfully to the contact with id ${data.contact_id}`,
                        rec_id: rec_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }

}
