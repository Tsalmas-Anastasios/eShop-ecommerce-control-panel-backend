import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { contactsListService, updateContactService, addContactService } from '../lib/contact.service';
import { contactPhoneDataInsertService, contactPhoneDataUpdateService } from '../lib/contact-phones-data.service';
import { contactEmailDataInsertService, contactEmailDataUpdateService } from '../lib/contacts-email-data.service';
import { contactAddressesInsertService, contactAddressesUpdateService } from '../lib/contact-addresses.service';
import { contactCustomFieldsInsertService, contactCustomFieldsUpdateService } from '../lib/contact-custom-fields.service';
import { addNewContactLabelService, updateContactLabelService } from '../lib/contact-labels.service';
import { contactPhotoFileStorage } from '../lib/connectors/fileStorage/contacts-photo';
import { Contact, ContactSearchDataArgs } from '../models';

require('dotenv').config();




export class ContactsRoutes {

    public routes(server: Application) {


        // general list
        server.route('/api/manage/contacts/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);

                    const contacts: Contact[] = await contactsListService.getList({ connected_account_id: account_id }, req);
                    return res.status(200).send(contacts);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }


            });





        // specific contact list
        server.route('/api/manage/contacts/specific-list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: ContactSearchDataArgs = new ContactSearchDataArgs({
                        contact_id: req?.query?.contact_id?.toString() || null,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        name: req?.query?.name?.toString() || null,
                        father_name: req?.query?.father_name?.toString() || null,
                        surname: req?.query?.surname?.toString() || null,
                        mother_name: req?.query?.mother_name?.toString() || null,
                        alias: req?.query?.alias?.toString() || null,
                        company: req?.query?.company?.toString() || null,
                        work_position_title: req?.query?.work_position_title?.toString() || null,
                        contact_label_id: req?.query?.contact_label_id?.toString() || null,
                        contact_label_str: req?.query?.contact_label_str?.toString() || null,
                        phone_number: req?.query?.phone_number?.toString() || null,
                        contact_email: req?.query?.contact_email?.toString() || null,
                        private: req?.query?.private ? Number(req.query.private) ? 1 : 0 : 0,
                        private_user_id: req?.query?.private_user_id?.toString() || null,
                        favorite: req?.query?.favorite ? Number(req.query.favorite) ? 1 : 0 : 0,
                        page: req?.query?.page ? Number(req.query.page) : 1
                    });


                    for (const param in params)
                        if (params[param] === undefined)
                            delete params[param];



                    const contacts: Contact[] = await contactsListService.getList(params, req);
                    return res.status(200).send(contacts);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // specific contact
        server.route('/api/manage/contacts/:contact_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const params = { contact_id: req.params.contact_id, connected_account_id: account_id };
                    const contact: Contact = await contactsListService.getContact(params, req);


                    return res.status(200).send(contact);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: Contact = req.body.contact;

                    const params: {
                        contact_id: string;
                        connected_account_id: string;
                    } = {
                        contact_id: req.params.contact_id.toString(),
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };


                    const account_id = utils.findAccountIDFromSessionObject(req);
                    if (!await contactsListService.contactExists(params.contact_id, params.connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact to be updated not found' }, res);


                    const existing_contact: Contact = await contactsListService.getContact(params, req);



                    // update contact here
                    data.connected_account_id = params.connected_account_id;
                    data.contact_id = params.contact_id;


                    Promise.all([
                        await updateContactService.updateContact(data),
                        await contactPhoneDataUpdateService.updateMultiplePhones(data.phones, existing_contact.phones, params.connected_account_id, params.contact_id),
                        await contactEmailDataUpdateService.updateMultipleEmails(data.emails, existing_contact.emails, params.connected_account_id, params.contact_id),
                        await contactAddressesUpdateService.updateMultipleAddresses(data.addresses, existing_contact.addresses, params.connected_account_id, params.contact_id),
                        await contactCustomFieldsUpdateService.updateMultipleCustomFields(data.custom_fields, existing_contact.custom_fields, params.connected_account_id, params.contact_id),
                        await updateContactLabelService.updateMultipleLabels(data.contact_labels, existing_contact.contact_labels, params.connected_account_id, params.contact_id),
                    ]);


                    return res.status(200).send({ code: 200, type: 'contact_updated', message: 'Contact update successfully!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                const data: Contact = req.body.contact;

                const params: {
                    contact_id: string;
                    connected_account_id: string;
                } = {
                    contact_id: req.params.contact_id.toString(),
                    connected_account_id: utils.findAccountIDFromSessionObject(req)
                };


                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    if (!await contactsListService.contactExists(params.contact_id, params.connected_account_id))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact to be updated not found' }, res);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }




                // delete contact
                try {

                    const result = await mysql.query(`
                        DELETE FROM
                            contacts
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id;
                    `, params);



                    return res.status(200).send({
                        code: 200,
                        type: 'contact_deleted',
                        message: 'Contact deleted successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // add new contact
        server.route('/api/manage/contacts/n/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: Contact = req.body.contact;
                    data.connected_account_id = utils.findAccountIDFromSessionObject(req);
                    // add new contact
                    if (!data?.name && !data?.surname)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'missing data (name)' }, res);


                    const contact_id = await addContactService.addContact(data);




                    Promise.all([
                        await contactPhoneDataInsertService.insertMultiplePhones(data.phones, data.connected_account_id, contact_id),
                        await contactEmailDataInsertService.addMultipleEmails(data.emails, data.connected_account_id, contact_id),
                        await contactAddressesInsertService.insertMultipleAddresses(data.addresses, { connected_account_id: data.connected_account_id, contact_id: contact_id }),
                        await contactCustomFieldsInsertService.insertMultipleFields(data.custom_fields, data.connected_account_id, contact_id),
                        await addNewContactLabelService.addMultipleLabels(data.contact_labels, data.connected_account_id, contact_id),
                    ]);





                    return res.status(200).send({
                        code: 200,
                        type: 'contact_added',
                        message: 'New contact added successfully',
                        contact_id: contact_id,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // save contact's image
        server.route('/api/manage/contacts/:contact_id/p/photo-manage')
            .put(utils.checkAuth, contactPhotoFileStorage.diskStorage.single('contact_photo'), async (req: Request, res: Response) => {

                const params: {
                    contact_id: string;
                    connected_account_id: string;
                    file_url: string;
                } = {
                    contact_id: req.params.contact_id.toString(),
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    file_url: `${process.env.CONTACTS_PHOTO_STORAGE_FOLDER}/${req.file.filename}`
                };



                try {

                    const result = await mysql.query(`
                        UPDATE
                            contacts
                        SET
                            image_url = :file_url
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id;
                    `, params);



                    return res.status(200).send({
                        code: 200,
                        type: 'contact_info_inserted_updated',
                        message: 'contact_info_inserted_updated',
                        originalname: req.file.originalname,
                        destination: req.file.destination,
                        filename: req.file.filename,
                        file_url: params.file_url
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


        // toggle contact's favorite status
        server.route('/api/manage/contacts/:contact_id/p/favorite')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                const params: {
                    contact_id: string;
                    connected_account_id: string;
                    favorite: number;
                } = {
                    contact_id: req.params.contact_id.toString(),
                    connected_account_id: utils.findAccountIDFromSessionObject(req),
                    favorite: req?.body?.favorite ? 1 : 0
                };



                try {

                    const result = await mysql.query(`
                        UPDATE
                            contacts
                        SET
                            favorite = :favorite
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id;
                    `, params);



                    return res.status(200).send({
                        code: 200,
                        type: 'toggle_favorite',
                        message: 'Favorite status changed successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
