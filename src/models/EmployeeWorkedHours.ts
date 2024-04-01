export class EmployeeWorkedHours {

    rec_id?: string;
    employee_id: string;
    connected_account_id?: string;
    date_day: string | Date;
    start_time: string | Date;
    end_time: string | Date;
    status: 'confirmed' | 'done' | 'declined' | 'deleted';

    constructor(props?: EmployeeWorkedHours) {

        this.rec_id = props?.rec_id || null;
        this.employee_id = props?.employee_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.date_day = props?.date_day || null;
        this.start_time = props?.start_time || null;
        this.end_time = props?.end_time || null;
        this.status = props?.status || null;

    }

}




export interface EmployeeWorkedHoursSearchArgsParamsGraphQL {

    rec_id?: string;
    employee_id: string;
    connected_account_id: string;
    status?: string;

}
