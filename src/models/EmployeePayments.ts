export class EmployeePayments {

    rec_id?: string;
    employee_id: string;
    connected_account_id?: string;
    version_label: string;
    hourly_payment: string;
    payment_frequency: string;
    hours_per_day: string;
    initial_payment_date: string | Date;
    active: boolean;

    constructor(props?: EmployeePayments) {

        this.rec_id = props?.rec_id || null;
        this.employee_id = props?.employee_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.version_label = props?.version_label || null;
        this.hourly_payment = props?.hourly_payment || null;
        this.payment_frequency = props?.payment_frequency || null;
        this.hours_per_day = props?.hours_per_day || null;
        this.initial_payment_date = props?.initial_payment_date || null;
        this.active = props?.active || false;

    }

}



export class EmployeePaymentsSearchArgsGraphQLParams {

    rec_id?: string;
    employee_id: string;
    connected_account_id: string;
    version_label?: string;

}
