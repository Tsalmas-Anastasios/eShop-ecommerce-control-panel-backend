import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';

import {
    contactAddressesListService, contactAddressesUpdateService, contactAddressesCheckerService,
    contactAddressesDeleteService, contactAddressesInsertService
} from '../lib/contact-addresses.service';
import { contactsListService, contactsCheckerService } from '../lib/contact.service';
import { Contact, ContactLabel, ContactSearchDataArgs, ContactLabelName, ContactAddressData, ContactEmailData } from '../models';





export class ContactAddressDataRoutes {

    public routes(server: Application) {


        server.route('/api/manage/contacts/:contact_id/addresses/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };


                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const addresses: ContactAddressData[] = await contactAddressesListService.getList(identifiers, req);

                    return res.status(200).send(addresses);

                } catch (error) {
                    return res.status(500).send({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null });
                }

            });




        server.route('/api/manage/contacts/:contact_id/addresses/:address_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {


                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };


                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const address: ContactAddressData = await contactAddressesListService.getAddress(identifiers, req);

                    return res.status(200).send(address);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id,
                        address_id: req.params.address_id
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    if (!await contactAddressesCheckerService.addressExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'address_not_found', message: 'Address doesn\'t exist on this contact' }, res);



                    const data: ContactAddressData = req.body;
                    await contactAddressesUpdateService.updateAddressRecord(data, identifiers);



                    return res.status(200).send({
                        code: 200,
                        type: 'address_updated',
                        message: 'Address updated successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id,
                        address_id: req.params.address_id
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    if (!await contactAddressesCheckerService.addressExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'address_not_found', message: 'Address doesn\'t exist on this contact' }, res);



                    await contactAddressesDeleteService.deleteAddress(identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'address_deleted_from_contact',
                        message: 'Address successfully deleted from contact'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/contacts/:contact_id/addresses/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactAddressData = req.body;
                    if (!data?.country || !data?.address || !data?.postal_code || !data?.city
                        || !data?.contact_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to insert new address' }, res);


                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id,
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const address_rec_id = await contactAddressesInsertService.insertNewAddress(data, identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'address_inserted',
                        message: 'address_inserted_successfully',
                        address_id: address_rec_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // insert a list of contact addresses
        server.route('/api/manage/contacts/:contact_id/addresses/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id,
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);



                    const data: ContactAddressData[] = req.body;
                    for (let i = 0; i < data.length; i++)
                        if (!data[i]?.country || !data[i]?.address || !data[i]?.postal_code || !data[i]?.city
                            || !data[i]?.contact_id)
                            return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to insert new address' }, res);



                    const addresses: ContactAddressData[] = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].rec_id = await contactAddressesInsertService.insertNewAddress(data[i], identifiers);
                        if (!data[i]?.address_line_2)
                            data[i].address_line_2 = null;
                        if (!data[i]?.postal_vault)
                            data[i].postal_vault = null;

                        addresses.push(data[i]);
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'addresses_inserted',
                        message: 'Addresses inserted successfully',
                        addresses: addresses
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
