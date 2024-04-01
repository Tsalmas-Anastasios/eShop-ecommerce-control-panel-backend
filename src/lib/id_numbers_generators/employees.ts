import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class EmployeeIDNumbersGenerator {


    getEmployeeID(): string {
        return `emp_${utils.generateId(config.employee_id_chars_length, config.nanoid_alphabet)}`;
    }

    getEmployeePaymentsID(): string {
        return `epa_${utils.generateId(config.employee_payments_version_id_chars_length, config.nanoid_alphabet)}`;
    }

    getEmployeeDonePaymentID(): string {
        return `edp_${utils.generateId(config.employee_done_payments_id_chars_length, config.nanoid_alphabet)}`;
    }

    getEmployeeWorkedHoursID(): string {
        return `ewh_${utils.generateId(config.employee_worked_hours_id_chars_length, config.nanoid_alphabet)}`;
    }


}




const employeeIDNumbersGenerator = new EmployeeIDNumbersGenerator();
export { employeeIDNumbersGenerator };
