import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';



import { contactsCheckerService } from '../lib/contact.service';
import {
    contactPhonesDataListService, contactPhoneDataCheckerService, contactPhoneDataUpdateService,
    contactPhoneDataDeleteService, contactPhoneDataInsertService
} from '../lib/contact-phones-data.service';
import {
    Contact, ContactLabel, ContactSearchDataArgs, ContactLabelName, ContactAddressData, ContactEmailData, ContactCustomFields,
    ContactPhoneDataSearchGraphQLData, ContactPhoneData
} from '../models';





export class ContactPhonesDataRouting {


    public routes(server: Application) {


        server.route('/api/manage/contacts/:contact_id/phone-data/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);



                    const phone_data: ContactPhoneData[] = await contactPhonesDataListService.getList(identifiers, req);

                    return res.status(200).send(phone_data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/contacts/:contact_id/phone-data/:phone_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params.phone_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);



                    const phone: ContactPhoneData = await contactPhonesDataListService.getPhone(identifiers, req);

                    return res.status(200).send(phone);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: ContactPhoneDataSearchGraphQLData = {
                        rec_id: req.params.phone_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);
                    if (!await contactPhoneDataCheckerService.phoneExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'phone_not_found', message: 'Current phone doesn\'t exist' }, res);



                    await contactPhoneDataUpdateService.updatePhone({
                        rec_id: identifiers.rec_id,
                        label: req.body?.label || null,
                        phone: req.body?.phone || null,
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    });


                    return res.status(200).send({ code: 200, type: 'phone_updated', message: 'Phone updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: ContactPhoneDataSearchGraphQLData = {
                        rec_id: req.params.phone_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);
                    if (!await contactPhoneDataCheckerService.phoneExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'phone_not_found', message: 'Current phone doesn\'t exist' }, res);



                    await contactPhoneDataDeleteService.deletePhone(identifiers);

                    return res.status(200).send({ code: 200, type: 'phone_deleted', message: 'Phone deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/contacts/:contact_id/phone-data/new/one')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactPhoneData = req.body;
                    if (!data?.label || !data?.phone)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be inserted' }, res);


                    const identifiers: ContactPhoneDataSearchGraphQLData = {
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    data.connected_account_id = identifiers.connected_account_id;
                    data.contact_id = identifiers.contact_id;


                    const rec_id = await contactPhoneDataInsertService.insertPhone(data);

                    return res.status(200).send({
                        code: 200,
                        type: 'phone_inserted',
                        message: 'Phone inserted successfully',
                        rec_id: rec_id,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/manage/contacts/:contact_id/phone-data/new/list')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactPhoneData[] = req.body;
                    for (let i = 0; i < data.length; i++)
                        if (!data[i].label || !data[i].phone)
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to be inserted' }, res);


                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };
                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);



                    const inserted_phones: ContactPhoneData[] = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].connected_account_id = identifiers.connected_account_id;
                        data[i].contact_id = identifiers.contact_id;
                        const rec_id = await contactPhoneDataInsertService.insertPhone(data[i]);
                        inserted_phones.push({
                            rec_id: rec_id,
                            label: data[i].label,
                            phone: data[i].phone
                        });
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'phones_inserted',
                        message: 'phones_inserted_successfully',
                        phones: inserted_phones
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
