import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';



import { contactsCheckerService } from '../lib/contact.service';
import {
    Contact, ContactLabel, ContactSearchDataArgs, ContactLabelName, ContactAddressData, ContactEmailData, ContactCustomFields,
    ContactEmailDataSearchParamsGraphQL
} from '../models';
import {
    contactsEmailDataListService, contactEmailDataCheckerService, contactEmailDataUpdateService,
    contactEmailDataDeleteService, contactEmailDataInsertService
} from '../lib/contacts-email-data.service';





export class ContactsEmailDataRoute {


    public routes(server: Application) {


        server.route('/api/manage/contacts/:contact_id/email-data/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const email_data: ContactEmailData[] = await contactsEmailDataListService.getList(identifiers, req);

                    return res.status(200).send(email_data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/contacts/:contact_id/email-data/:email_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params.email_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };



                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const email: ContactEmailData = await contactsEmailDataListService.getEmail(identifiers, req);


                    return res.status(200).send(email);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params.email_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };



                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);
                    if (!await contactEmailDataCheckerService.emailExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'email_not_found', message: 'Email data not found for this contact' }, res);


                    const data: ContactEmailData = {
                        rec_id: identifiers.rec_id,
                        label: req.body?.label || null,
                        value: req.body?.value || null,
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id,
                    };


                    await contactEmailDataUpdateService.updateEmail(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'email_updated',
                        message: 'Email updated successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params.email_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);
                    if (!await contactEmailDataCheckerService.emailExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'email_not_found', message: 'Email data not found for this contact' }, res);


                    await contactEmailDataDeleteService.deleteEmail(identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'email_deleted',
                        message: 'Email successfully deleted from the contact'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/:contact_id/email-data/new/one')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactEmailData = req.body;
                    if (!data?.label || !data?.value)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be inserted' }, res);


                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    data.connected_account_id = utils.findAccountIDFromSessionObject(req);
                    data.contact_id = req.params.contact_id;


                    const rec_id = await contactEmailDataInsertService.addNewEmail(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'email_inserted',
                        message: 'Email inserted successfully',
                        rec_id: rec_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/:contact_id/email-data/new/list')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactEmailData[] = req.body;
                    for (let i = 0; i < data.length; i++)
                        if (!data[i]?.label || !data[i]?.value)
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be inserted' }, res);


                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);




                    // insert emails in the db
                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const contact_id = req.params.contact_id;

                    const inserted_emails: ContactEmailData[] = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].connected_account_id = account_id;
                        data[i].contact_id = contact_id;
                        const rec_id = await contactEmailDataInsertService.addNewEmail(data[i]);
                        inserted_emails.push({
                            rec_id: rec_id,
                            label: data[i].label,
                            value: data[i].value,
                        });
                    }


                    return res.status(200).send({
                        code: 200,
                        type: 'emails_inserted',
                        message: 'Emails inserted successfully',
                        emails: inserted_emails
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }

}
