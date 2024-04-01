import { EmployeeDonePayments } from './index';
import { EmployeePayments } from './index';
import { EmployeeWorkedHours } from './index';



export class EmployeeInfoData {

    employee_id?: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    fathers_name: string;
    mothers_name: string;
    mother_last_name: string;
    tax_id: string;
    social_security_number_amka: string;
    date_of_birth: string | Date;
    date_of_birth_epoch: number;
    company: string;
    position: string;
    phone_number: string;
    work_phone_number?: string;
    home_phone_number?: string;
    other_phone_number?: string;
    email: string;
    work_email?: string;
    other_email?: string;
    address: string;
    postal_code: string;
    city: string;
    notes?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    messenger_url?: string;
    whatsup_url?: string;
    telegram_url?: string;
    viber_url?: string;
    status: 'active_full_time' | 'active_part_time' | 'inactive' | 'on_leave_paid' | 'on_leave_unpaid' | 'fired' | 'resigned';
    start_at: string | Date;
    end_at?: string | Date;
    created_at?: string | Date;
    connected_account_id?: string;



    // not in db
    employee_done_payments?: EmployeeDonePayments[];
    employee_payments?: EmployeePayments[];
    employee_worked_hours?: EmployeeWorkedHours[];



    constructor(props?: EmployeeInfoData) {

        this.employee_id = props?.employee_id || null;
        this.first_name = props?.first_name || null;
        this.middle_name = props?.middle_name || null;
        this.last_name = props?.last_name || null;
        this.fathers_name = props?.fathers_name || null;
        this.mothers_name = props?.mothers_name || null;
        this.mother_last_name = props?.mother_last_name || null;
        this.tax_id = props?.tax_id || null;
        this.social_security_number_amka = props?.social_security_number_amka || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.date_of_birth_epoch = props?.date_of_birth_epoch || null;
        this.company = props?.company || null;
        this.position = props?.position || null;
        this.phone_number = props?.phone_number || null;
        this.work_phone_number = props?.work_phone_number || null;
        this.home_phone_number = props?.home_phone_number || null;
        this.other_phone_number = props?.other_phone_number || null;
        this.email = props?.email || null;
        this.work_email = props?.work_email || null;
        this.other_email = props?.other_email || null;
        this.address = props?.address || null;
        this.postal_code = props?.postal_code || null;
        this.city = props?.city || null;
        this.notes = props?.notes || null;
        this.facebook_url = props?.facebook_url || null;
        this.instagram_url = props?.instagram_url || null;
        this.linkedin_url = props?.linkedin_url || null;
        this.messenger_url = props?.messenger_url || null;
        this.whatsup_url = props?.whatsup_url || null;
        this.telegram_url = props?.telegram_url || null;
        this.viber_url = props?.viber_url || null;
        this.status = props?.status || null;
        this.start_at = props?.start_at || null;
        this.end_at = props?.end_at || null;
        this.created_at = props?.created_at || null;
        this.connected_account_id = props?.connected_account_id || null;


        // not in db
        this.employee_done_payments = props?.employee_done_payments || null;
        this.employee_payments = props?.employee_payments || null;
        this.employee_worked_hours = props?.employee_worked_hours || null;

    }

}




export class EmployeeInfoSearchParamsArgs {

    employee_id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    fathers_name?: string;
    mothers_name?: string;
    mother_last_name?: string;
    tax_id?: string;
    social_security_number_amka?: string;
    phone_number?: string;
    email?: string;
    status?: string;
    connected_account_id: string;
    page?: number;

    constructor(props?: EmployeeInfoSearchParamsArgs) {

        this.employee_id = props?.employee_id || null;
        this.first_name = props?.first_name || null;
        this.middle_name = props?.middle_name || null;
        this.last_name = props?.last_name || null;
        this.fathers_name = props?.fathers_name || null;
        this.mothers_name = props?.mothers_name || null;
        this.mother_last_name = props?.mother_last_name || null;
        this.tax_id = props?.tax_id || null;
        this.social_security_number_amka = props?.social_security_number_amka || null;
        this.phone_number = props?.phone_number || null;
        this.email = props?.email || null;
        this.status = props?.status || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.page = props?.page || null;

    }

}
