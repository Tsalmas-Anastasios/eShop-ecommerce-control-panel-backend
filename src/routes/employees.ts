import { Application, Request, Response, request } from 'express';
import {
    EmployeeDonePayments, EmployeeInfoData, EmployeePayments, EmployeeWorkedHours
} from '../models';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    employeesListGETService, employeeCheckerService, employeeUpdateService,
    employeesDeleteService, employeeInsertService
} from '../lib/employee-basic-data.service';





export class EmployeeDataRoutes {

    public routes(server: Application) {


        server.route('/api/manage/employees/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const employees: EmployeeInfoData[] = await employeesListGETService.getList({ connected_account_id: account_id }, req);

                    return res.status(200).send(employees);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        server.route('/api/manage/employees/:employee_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    const employee: EmployeeInfoData = await employeesListGETService.getEmployeeData(identifiers, req);

                    return res.status(200).send(employee);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'employee_not_found', message: 'Employee doesn\'t exist' }, res);



                    const data: EmployeeInfoData = req.body;
                    if (!data?.first_name && !data?.last_name && !data?.fathers_name && !data?.mothers_name
                        && !data?.mother_last_name && !data?.tax_id && !data?.social_security_number_amka
                        && !data?.date_of_birth && !data?.date_of_birth_epoch && !data?.company && !data?.position
                        && !data?.phone_number && !data?.work_phone_number && !data?.home_phone_number
                        && !data?.other_phone_number && !data?.email && !data?.work_email && !data?.other_email
                        && !data?.address && !data?.postal_code && !data?.city && !data?.notes && !data?.facebook_url
                        && !data?.instagram_url && !data?.linkedin_url && !data?.messenger_url && !data?.whatsup_url
                        && !data?.telegram_url && !data?.viber_url && !data?.status && !data?.start_at)
                        return res.status(201).send({ code: 201, type: 'nothing_for_update', message: 'Nothing to update' });



                    await employeeUpdateService.updateEmployeeData(data, identifiers);


                    return res.status(200).send({ code: 200, type: 'employee_basic_data_updated', message: 'Employee basic data just updated!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({ code: 404, type: 'employee_not_found', message: 'Employee doesn\'t exist' }, res);


                    const delete_status = req.query.status.toString();
                    if (delete_status !== 'fired' && delete_status !== 'resigned')
                        return utils.errorHandlingReturn({ code: 400, type: 'wrong_status_to_delete', message: 'Invalid putted status value' }, res);


                    await employeesDeleteService.deleteEmployee(identifiers, delete_status);


                    return res.status(200).send({ code: 200, type: 'employee_archived', message: 'Employee archived' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/manage/employees/l/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeInfoData = req.body;
                    if (!data?.first_name || !data?.last_name || !data?.fathers_name
                        || !data?.mothers_name || !data?.mother_last_name || !data?.tax_id
                        || !data?.social_security_number_amka || !data?.date_of_birth || !data?.company
                        || !data?.position || !data?.phone_number || !data?.work_phone_number
                        || !data?.home_phone_number || !data?.other_phone_number || !data?.email
                        || !data?.work_email || !data?.other_email || !data?.address || !data?.postal_code
                        || !data?.city || !data?.status || !data?.start_at)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_data',
                            message: 'Missing data & cannot save new employee'
                        }, res);



                    const account_id = utils.findAccountIDFromSessionObject(req);


                    const new_employee_id = await employeeInsertService.addNewEmployee(data, account_id);


                    return res.status(200).send({
                        code: 200,
                        type: 'employee_inserted',
                        message: 'Employee inserted successfully',
                        employee_id: new_employee_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }

}
