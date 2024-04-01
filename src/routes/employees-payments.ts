import { Application, Request, Response, request } from 'express';
import {
    EmployeeDonePayments, EmployeeInfoData, EmployeePayments, EmployeeWorkedHours
} from '../models';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';

import { employeeCheckerService } from '../lib/employee-basic-data.service';
import {
    employeePaymentsDataListService, employeePaymentsDataCheckerService, employeePaymentsDataUpdateService,
    employeePaymentsDataDeleteService, employeePaymentsDataInsertService
} from '../lib/employee-payments-data.service';




export class EmployeePaymentDataRoutes {


    public routes(server: Application) {


        server.route('/api/manage/employees/:employee_id/payments/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };


                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const employee_payments: EmployeePayments[] = await employeePaymentsDataListService.getList(identifiers, req);


                    return res.status(200).send(employee_payments);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/payments/:payment_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const employee_payment: EmployeePayments = await employeePaymentsDataListService.getEmployeePaymentOne(identifiers, req);


                    return res.status(200).send(employee_payment);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        payment_id: req.params.payment_id
                    };


                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);

                    if (!await employeePaymentsDataCheckerService.paymentExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'payment_version_not_found',
                            message: 'Payment version doesn\'t exist'
                        }, res);




                    const data: EmployeePayments = req.body.payment;
                    if (!data?.version_label && !data?.hourly_payment && !data?.payment_frequency
                        && !data?.hours_per_day && !data?.initial_payment_date && !data?.active)
                        return res.status(201).send({ code: 201, type: 'no_need_to_update', message: 'Payment version doesn\'t need to be updated' });


                    await employeePaymentsDataUpdateService.updatePaymentVersion(data, identifiers);

                    if (data?.active && data.active === true)
                        await employeePaymentsDataUpdateService.updateActiveStatus(identifiers);

                    return res.status(200).send({
                        code: 200,
                        type: 'payment_version_updated',
                        message: 'Employee payment version updated successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        payment_id: req.params.payment_id
                    };


                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);

                    if (!await employeePaymentsDataCheckerService.paymentExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'payment_version_not_found',
                            message: 'Payment version doesn\'t exist'
                        }, res);


                    await employeePaymentsDataDeleteService.deleteVersion(identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'payment_version_deleted',
                        message: 'Payment version deleted and cannot be restored',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/payments/l/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeePayments = req.body;
                    if (!data?.version_label || !data?.hourly_payment || !data?.payment_frequency
                        || !data?.hours_per_day || !data?.initial_payment_date || !data?.active)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to save new payment version' }, res);


                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);


                    const payment_id = await employeePaymentsDataInsertService.addNewPaymentVersion(data, identifiers);

                    if (data.active)
                        await employeePaymentsDataUpdateService.updateActiveStatus({
                            employee_id: identifiers.employee_id,
                            connected_account_id: identifiers.connected_account_id,
                            payment_id: payment_id
                        });

                    return res.status(200).send({
                        code: 200,
                        type: 'payment_version_inserted',
                        message: 'Payment version inserted successfully',
                        payment_version_id: payment_id,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
