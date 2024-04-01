import { utils } from '../../lib/utils.service';
import { config } from '../../config';



class OrderIDNumbersGenerator {

    getNewOrderId(): string {
        return `ord_${utils.generateId(config.order_id_random_chars_length, config.nanoid_alphabet)}`;
    }

    getNewOrderPaymentTypeId(): string {
        return `otp_${utils.generateId(config.order_payment_type_id_chars_length, config.nanoid_alphabet)}`;
    }

    getNewOrderProductId(): string {
        return `orp_${utils.generateId(config.order_products_id_chars_length, config.nanoid_alphabet)}`;
    }


    getNewInvoiceID(): string {
        return `inv_${utils.generateId(config.invoice_number_length, config.nanoid_alphabet)}`;
    }

    getNewTrackingID(): string {
        return `tracking_${utils.generateId(config.order_tracking_number_ID_length, config.nanoid_alphabet)}`;
    }

    // generate numbers
    getNewOrderNumberForUser(): string {
        return `${utils.generateId(config.order_number_length, config.order_number_alphabet)}-${utils.generateId(config.order_number_length, config.order_number_alphabet)}`;
    }


    // generate calculated id
    getNewOrdersCalcID(): string {
        return `ordcalc_${utils.generateId(config.orders_calculator_id_chars_length, config.nanoid_alphabet)}`;
    }


    // generate order paper id
    getNewOrderPaperID(): string {
        return `ordpaper_${utils.generateId(config.order_paper_id_chars_length, config.nanoid_alphabet)}`;
    }

}


const orderIDNumbersGenerator = new OrderIDNumbersGenerator();
export { orderIDNumbersGenerator };
