import { Application, Request, Response, request } from 'express';
import {
    EmployeeWorkedHours, EmployeeWorkedHoursSearchArgsParamsGraphQL
} from '../models';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';

import { employeeCheckerService } from '../lib/employee-basic-data.service';
import {
    employeeWorkedHoursListService, employeeWorkedHoursCheckerService,
    employeeWorkedHoursUpdateService, employeeWorkedHoursDeleteService,
    employeeWorkedHoursInsertNewService
} from '../lib/employees-work-hours.service';






export class EmployeesWorkHoursRoutes {


    public routes(server: Application) {



        server.route('/api/manage/employees/:employee_id/work-hours')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: EmployeeWorkedHoursSearchArgsParamsGraphQL = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };
                    if (!await employeeCheckerService.employeeExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const employee_worked_hours: EmployeeWorkedHours[] = await employeeWorkedHoursListService.getList(identifiers, req);

                    return res.status(200).send(employee_worked_hours);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/work-hours-specific')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: EmployeeWorkedHoursSearchArgsParamsGraphQL = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.query
                    };

                    if (!await employeeCheckerService.employeeExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    const employee_worked_hours: EmployeeWorkedHours[] = await employeeWorkedHoursListService.getList(params, req);

                    return res.status(200).send(employee_worked_hours);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        server.route('/api/manage/employees/:employee_id/work-hours/:rec_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: EmployeeWorkedHoursSearchArgsParamsGraphQL = {
                        rec_id: req.params.rec_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await employeeCheckerService.employeeExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);




                    const employee_worked_hour: EmployeeWorkedHours = await employeeWorkedHoursListService.getWorkedHour(params, req);

                    return res.status(200).send(employee_worked_hour);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeWorkedHours = {
                        rec_id: req.params.rec_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.body
                    };

                    if (!await employeeCheckerService.employeeExists({
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id,
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);

                    if (!await employeeWorkedHoursCheckerService.hoursExist({
                        rec_id: data.rec_id,
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'work_hours_version_not_found',
                            message: 'Work hours version not found'
                        }, res);



                    if (!data?.date_day && !data?.start_time && !data?.end_time && !data?.status)
                        return res.status(201).send({
                            code: 201,
                            type: 'nothing_to_update',
                            message: 'Nothing to update - Data is up to date',
                        });


                    if (data?.status)
                        if (data.status !== 'confirmed' && data.status !== 'declined' && data.status !== 'deleted'
                            && data.status !== 'done')
                            return utils.errorHandlingReturn({
                                code: 400,
                                type: 'bad_request',
                                message: 'Wrong status value',
                            }, res);



                    await employeeWorkedHoursUpdateService.updateWorkHours(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'data_updated',
                        message: 'Data updated successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params.rec_id,
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };

                    if (!await employeeCheckerService.employeeExists({
                        employee_id: identifiers.employee_id,
                        connected_account_id: identifiers.connected_account_id,
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);

                    if (!await employeeWorkedHoursCheckerService.hoursExist({
                        rec_id: identifiers.rec_id,
                        employee_id: identifiers.employee_id,
                        connected_account_id: identifiers.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 405,
                            type: 'work_hours_version_not_found',
                            message: 'Work hours version not found'
                        }, res);



                    await employeeWorkedHoursDeleteService.deleteRecord(identifiers);


                    return res.status(200).send({
                        code: 200,
                        type: 'data_deleted',
                        message: 'Data deleted successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        server.route('/api/manage/employees/:employee_id/work-hours/n/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeWorkedHours = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.body
                    };

                    if (!await employeeCheckerService.employeeExists({
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);



                    if (!data?.date_day || !data?.end_time || !data?.start_time)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_data',
                            message: 'Missing data to save',
                        }, res);


                    const new_rec_id = await employeeWorkedHoursInsertNewService.insertNewDate(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'data_inserted',
                        message: 'Data for worked hours inserted successfully',
                        new_rec_id: new_rec_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/manage/employees/:employee_id/work-hours/n/new-multiple-days')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: EmployeeWorkedHours = {
                        employee_id: req.params.employee_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                        ...req.body
                    };

                    const days: any = req.query.days_array;

                    if (!await employeeCheckerService.employeeExists({
                        employee_id: data.employee_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'employee_not_found',
                            message: 'Employee doesn\'t found'
                        }, res);


                    const new_records_id = [];
                    for (let i = 0; i < days.length; i++) {

                        const temp_id = await employeeWorkedHoursInsertNewService.insertNewDate({
                            ...data,
                            date_day: days[i]
                        });

                        new_records_id.push({
                            date_day: days[i],
                            new_record_id: temp_id
                        });

                    }



                    return res.status(200).send({
                        code: 200,
                        type: 'data_inserted_successfully',
                        message: 'Data for employee worked hours inserted successfully',
                        new_records_id: new_records_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
