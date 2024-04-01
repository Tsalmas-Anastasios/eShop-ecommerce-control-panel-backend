import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config } from '../config';


import {
    customFieldsListService, contactCustomFieldsCheckerService, contactCustomFieldsUpdateService,
    contactCustomFieldsDeleteService, contactCustomFieldsInsertService
} from '../lib/contact-custom-fields.service';
import { contactsCheckerService } from '../lib/contact.service';
import {
    Contact, ContactLabel, ContactSearchDataArgs, ContactLabelName, ContactAddressData, ContactEmailData, ContactCustomFields,
    ContactCustomFieldsArgumentsSearchListGraphQL
} from '../models';





export class ContactCustomFieldsRoutes {


    public routes(server: Application) {


        server.route('/api/manage/contacts/:contact_id/custom-fields/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    const custom_fields: ContactCustomFields[] = await customFieldsListService.getList(identifiers, req);
                    return res.status(200).send(custom_fields);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });






        server.route('/api/managee/contacts/:contact_id/custom-fields/:field_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {


                try {

                    const identifiers: ContactCustomFieldsArgumentsSearchListGraphQL = {
                        rec_id: req.params.field_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await contactsCheckerService.contactExists({ connected_account_id: identifiers.connected_account_id, contact_id: identifiers.contact_id }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const custom_field: ContactCustomFields = await customFieldsListService.getCustomField(identifiers, req);

                    return res.status(200).send(custom_field);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }


            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: ContactCustomFieldsArgumentsSearchListGraphQL = {
                        rec_id: req.params.field_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id,
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    if (!await contactCustomFieldsCheckerService.customFieldExist(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'custom_field_not_found', message: 'Custom field not found and cannot be updated' }, res);


                    // check the validation
                    if (!req.body?.label && !req.body?.value)
                        return res.status(400).send({ code: 400, type: 'missing_data', message: 'No data to be updated' });



                    await contactCustomFieldsUpdateService.updateCustomField({
                        rec_id: identifiers.rec_id,
                        label: req.body?.label || null,
                        value: req.body?.value || null,
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id
                    });


                    return res.status(200).send({
                        code: 200,
                        type: 'custom_field_updated',
                        message: 'Custom field updated successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: ContactCustomFieldsArgumentsSearchListGraphQL = {
                        rec_id: req.params.field_id,
                        contact_id: req.params.contact_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: identifiers.connected_account_id,
                        contact_id: identifiers.contact_id,
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);

                    if (!await contactCustomFieldsCheckerService.customFieldExist(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'custom_field_not_found', message: 'Custom field not found and cannot be updated' }, res);



                    await contactCustomFieldsDeleteService.deleteCustomFieldOne(identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'custom_field_deleted',
                        message: 'Custom field deleted from contact'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/manage/contacts/:contact_id/custom-fields/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactCustomFields = req.body;
                    if (!data?.label || !data?.value)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to insert a new record of custom_fields' }, res);

                    data.connected_account_id = utils.findAccountIDFromSessionObject(req);
                    data.contact_id = req.params.contact_id;


                    if (!await contactsCheckerService.contactExists({
                        connected_account_id: data.connected_account_id,
                        contact_id: data.contact_id,
                    }))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);



                    const new_custom_field_id = await contactCustomFieldsInsertService.insertNew(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'custom_field_inserted',
                        message: 'Custom field inserted successfully',
                        rec_id: new_custom_field_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/contacts/:contact_id/custom-fields/new-list')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: ContactCustomFields[] = req.body;
                    for (let i = 0; i < data.length; i++)
                        if (!data[i]?.label || !data[i]?.value)
                            return utils.errorHandlingReturn({
                                code: 400,
                                type: 'missing_data',
                                message: 'Missing data to insert a new record of custom_fields',
                                req_number: i + 1
                            }, res);


                    const identifiers = {
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        contact_id: req.params.contact_id
                    };

                    if (!await contactsCheckerService.contactExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'contact_not_found', message: 'Contact doesn\'t exist' }, res);


                    const custom_fields: ContactCustomFields[] = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].connected_account_id = identifiers.connected_account_id;
                        data[i].contact_id = identifiers.contact_id;

                        custom_fields.push({
                            rec_id: await contactCustomFieldsInsertService.insertNew(data[i]),
                            label: data[i].label,
                            value: data[i].value
                        });
                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'custom_fields_inserted',
                        message: 'Custom fields inserted successfully',
                        custom_fields: custom_fields
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }


}
