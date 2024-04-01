import { Application, Request, Response, request } from 'express';
import {
    EmployeeDonePayments, EmployeeInfoData, EmployeePayments, EmployeeWorkedHours,
    EmployeeDonePaymentsSearchArgsGraphQLParams
} from '../models';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';

import { employeeCheckerService } from '../lib/employee-basic-data.service';
import {
    employeeDonePaymentsListService, employeeDonePaymentsCheckerService,
    employeeDonePaymentsUpdateService, employeeDonePaymentDeleteService,
    employeeDonePaymentsInsertNewSearch
} from '../lib/employee-done-payments.service';





export class EmployeesDonePaymentsRoutes {

    public routes(server: Application) {


        server.route('/api/manage/employees/:employee_id/payments/done/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };
                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);


                    const employee_done_payments: EmployeeDonePayments[] = await employeeDonePaymentsListService.getList(identifiers, req);


                    return res.status(200).send(employee_done_payments);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/payments/done/specific-list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: EmployeeDonePaymentsSearchArgsGraphQLParams = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.query
                    };
                    if (!await employeeCheckerService.employeeExists({
                        connected_account_id: params.connected_account_id,
                        employee_id: params.employee_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const employee_done_payments: EmployeeDonePayments[] = await employeeDonePaymentsListService.getList(params, req);


                    return res.status(200).send(employee_done_payments);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/payments/done/m/:payment_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: EmployeeDonePaymentsSearchArgsGraphQLParams = {
                        rec_id: req.params.payment_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };
                    if (!await employeeCheckerService.employeeExists({
                        connected_account_id: params.connected_account_id,
                        employee_id: params.employee_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const done_payment_data: EmployeeDonePayments = await employeeDonePaymentsListService.getOnePayment(params, req);


                    return res.status(200).send(done_payment_data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeDonePayments = {
                        rec_id: req.params.payment_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.body.payment
                    };

                    if (!await employeeCheckerService.employeeExists({
                        connected_account_id: data.connected_account_id,
                        employee_id: data.employee_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    if (!await employeeDonePaymentsCheckerService.donePaymentExists({
                        rec_id: data.rec_id,
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'payment_not_found',
                            message: 'payment_not_found'
                        }, res);



                    if (!data?.payment_version_id && !data?.payment_date_time && !data?.status)
                        return res.status(201).send({
                            code: 201,
                            type: 'nothing_to_update',
                            message: 'nothing_to_update',
                        });



                    await employeeDonePaymentsUpdateService.updateDonePayment(data);



                    return res.status(200).send({
                        code: 200,
                        type: 'updated_successfully',
                        message: 'Employee done payment successfully updated',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data = {
                        rec_id: req.params.payment_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await employeeCheckerService.employeeExists({
                        connected_account_id: data.connected_account_id,
                        employee_id: data.employee_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);

                    if (!await employeeDonePaymentsCheckerService.donePaymentExists({
                        rec_id: data.rec_id,
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'payment_not_found',
                            message: 'payment_not_found'
                        }, res);



                    await employeeDonePaymentDeleteService.deleteDonePayment(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'payment_deleted',
                        message: 'Payment deleted successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        server.route('/api/manage/employees/:employee_id/payments/done/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeDonePayments = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.body.payment
                    };
                    if (!data?.payment_version_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'forbidden', message: 'Missing data to create new done payment' }, res);

                    if (!await employeeCheckerService.employeeExists({
                        connected_account_id: data.connected_account_id,
                        employee_id: data.employee_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);




                    await employeeDonePaymentsInsertNewSearch.insertNewDonePayment(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'payment_done',
                        message: 'Payment completed & inserted to the archive',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }

}
