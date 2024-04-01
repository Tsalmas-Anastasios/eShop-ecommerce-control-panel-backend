export class EmployeeDonePayments {

    rec_id?: string;
    employee_id: string;
    connected_account_id?: string;
    payment_version_id: string;
    payment_date_time: string | Date;
    status?: 'done';

    constructor(props?: EmployeeDonePayments) {

        this.rec_id = props?.rec_id || null;
        this.employee_id = props?.employee_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.payment_version_id = props?.payment_version_id || null;
        this.payment_date_time = props?.payment_date_time || null;
        this.status = 'done';

    }

}




export class EmployeeDonePaymentsSearchArgsGraphQLParams {

    rec_id?: string;
    employee_id: string;
    connected_account_id: string;
    payment_version_id?: string;
    payment_date_time?: string;

    constructor(props?: EmployeeDonePaymentsSearchArgsGraphQLParams) {

        this.rec_id = props?.rec_id || null;
        this.employee_id = props?.employee_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.payment_version_id = props?.payment_version_id || null;
        this.payment_date_time = props?.payment_date_time || null;

    }

}
