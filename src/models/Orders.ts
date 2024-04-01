import { Company } from './Company';
import { OrderPaymentMethod } from './OrderPaymentMethod';
import { ProductImage } from './ProductImages';
import { ProductSpecificationCategory } from './Products';
import { ProductStock } from './Products';
import { TransferCompanyData } from './TransferCompanies';


export class Order {

    order_id?: string;
    proof: 'receipt' | 'invoice';
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    phone: string;
    cell_phone?: string;
    confirm_date?: string | Date;
    sent_date?: string | Date;
    completed_date?: string | Date;
    archived_date?: string | Date;
    returned_date?: string | Date;
    confirmed?: boolean;
    sent?: boolean;
    completed?: boolean;

    transfer_courier: string;
    transfer_courier_details?: TransferCompanyData;

    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned';
    invoice_data__first_name?: string;
    invoice_data__last_name?: string;
    invoice_data__company?: string;
    invoice_data__tax_number?: string;
    invoice_data__doy?: string;
    invoice_data__address?: string;
    invoice_data__postal_code?: string;
    invoice_data__city?: string;
    invoice_data__country?: string;
    invoice_data__phone?: string;
    invoice_data__cell_phone?: string;
    invoice_data__is_valid?: boolean;
    payment_type: string;

    payment_type_details?: OrderPaymentMethod;

    connected_account_id?: string;

    order_number?: string;
    order_number_formatted?: any;

    invoice_data__invoice_number?: string;
    archived?: string;

    // costs
    clear_value?: number;
    transportation?: number;
    cash_on_delivery_payment: boolean;
    cash_on_delivery?: number;
    extra_fees: boolean;
    extra_fees_costs?: number;
    fees: number;
    fee_percent?: number;
    order_total?: number;

    // tracking
    tracking_number?: string;
    tracking_url?: string;

    // notes
    notes?: string;

    order_seen?: boolean;


    // company data --- not in db
    company_data?: Company;

    constructor(props?: Order) {

        this.order_id = props?.order_id || null;
        this.proof = props?.proof || 'receipt';
        this.email = props?.email || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.address = props?.address || null;
        this.postal_code = props?.postal_code || null;
        this.city = props?.city || null;
        this.country = props?.country || null;
        this.phone = props?.phone || null;
        this.cell_phone = props?.cell_phone || null;
        this.confirm_date = props?.confirm_date || null;
        this.sent_date = props?.sent_date || null;
        this.completed_date = props?.completed_date || null;
        this.archived_date = props?.archived_date || null;
        this.returned_date = props?.returned_date || null;
        this.confirmed = props?.confirmed || null;
        this.sent = props?.sent || null;
        this.completed = props?.completed || null;

        this.transfer_courier = props?.transfer_courier || null;
        this.transfer_courier_details = props?.transfer_courier_details || null;

        this.current_status = props?.current_status || null;
        this.invoice_data__first_name = props?.invoice_data__first_name || null;
        this.invoice_data__last_name = props?.invoice_data__last_name || null;
        this.invoice_data__company = props?.invoice_data__company || null;
        this.invoice_data__tax_number = props?.invoice_data__tax_number || null;
        this.invoice_data__doy = props?.invoice_data__doy || null;
        this.invoice_data__address = props?.invoice_data__address || null;
        this.invoice_data__postal_code = props?.invoice_data__postal_code || null;
        this.invoice_data__city = props?.invoice_data__city || null;
        this.invoice_data__country = props?.invoice_data__country || null;
        this.invoice_data__phone = props?.invoice_data__phone || null;
        this.invoice_data__cell_phone = props?.invoice_data__cell_phone || null;
        this.invoice_data__is_valid = props?.invoice_data__is_valid || null;

        this.payment_type = props?.payment_type || null;
        this.payment_type_details = props?.payment_type_details || null;

        this.connected_account_id = props?.connected_account_id || null;
        this.order_number = props?.order_number || null;
        this.invoice_data__invoice_number = props?.invoice_data__invoice_number || null;
        this.archived = props?.archived || null;

        // costs
        this.clear_value = props?.clear_value || 0;
        this.transportation = props?.transportation || 0;
        this.cash_on_delivery_payment = props?.cash_on_delivery_payment || false;
        this.cash_on_delivery = this.cash_on_delivery_payment ? props?.cash_on_delivery || 0 : null;
        this.extra_fees = props?.extra_fees || false;
        this.extra_fees_costs = this.extra_fees ? props?.extra_fees_costs || 0 : null;
        this.fees = props?.fees || 0;
        this.fee_percent = props?.fee_percent || null;
        this.order_total = props?.order_total || this.clear_value + this.transportation + this.cash_on_delivery + this.extra_fees_costs + this.fees;

        // tracking number
        this.tracking_number = props?.tracking_number || null;
        this.tracking_url = props?.tracking_url || null;

        this.order_seen = props?.order_seen ? true : false;

        // notes
        this.notes = props?.notes || null;

    }

}





export class OrderProductIdentifiers {

    rec_id?: string;
    product_id: string;
    order_id?: string;
    connected_account_id?: string;
    active?: boolean;
    archived?: boolean;
    quantity: number;
    supplied_customer_price: number;
    discount?: number;
    discount_percent?: number;
    fees: number;
    fee_percent: number;

    // not in db
    status?: 'static' | 'new' | 'updated' | 'deleted';
    main_image?: ProductImage;

    product_details?: OrderProductDetails;

    constructor(props?: OrderProductIdentifiers) {

        this.rec_id = props?.rec_id || null;
        this.product_id = props?.product_id || null;
        this.order_id = props?.order_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.active = props?.active || null;
        this.archived = props?.archived || null;
        this.quantity = props?.quantity || 1;
        this.supplied_customer_price = props?.supplied_customer_price || null;
        this.discount = props?.discount || null;
        this.discount_percent = props.discount_percent || null;
        this.fees = props?.fees || null;
        this.fee_percent = props?.fee_percent || null;

        this.product_details = props?.product_details || null;

    }

}



export class OrderProductDetails {

    product_id?: string;
    headline: string;
    product_brand: string;
    categories_belongs: string;
    product_code: string;
    product_model: string;
    stock: number;
    supplied_price: number;
    clear_price: number;
    fee_percent: number;
    fees: number;
    discount_percent: number;
    discount: number;

    specification: ProductSpecificationCategory[];

    product_description: string;
    supplier: string;
    current_status: string;
    archived: boolean;
    notes: string;
    created_at: string | Date;
    current_version: string;
    product_shared?: boolean;

    images: ProductImage[];
    product_stock: ProductStock[];

    constructor(props?: OrderProductDetails) {

        this.product_id = props?.product_id || null;
        this.headline = props?.headline || null;
        this.product_brand = props?.product_brand || null;
        this.categories_belongs = props?.categories_belongs || null;
        this.product_code = props?.product_code || null;
        this.product_model = props?.product_model || null;
        this.stock = props?.stock || null;
        this.supplied_price = props?.supplied_price || null;
        this.clear_price = props?.clear_price || null;
        this.fee_percent = props?.fee_percent || null;
        this.fees = props?.fees || null;
        this.discount_percent = props?.discount_percent || 0;
        this.discount = props?.discount || 0;

        this.specification = props?.specification || [];

        this.product_description = props?.product_description || null;
        this.supplier = props?.supplier || null;
        this.current_status = props?.current_status || null;
        this.archived = props?.archived || null;
        this.notes = props?.notes || null;
        this.created_at = props?.created_at || null;
        this.current_version = props?.current_version || null;
        this.product_shared = props?.product_shared ? true : false;

        this.images = props?.images || null;
        this.product_stock = props?.product_stock || [];

    }



    // calculate the total product stock
    public calculateProductStock(productStockObj: ProductStock[]): number {

        let total_stock = 0;

        for (const stock of productStockObj)
            total_stock += stock.stock_quantity;


        return total_stock;

    }

}



export class OrderProducts {

    order_products: OrderProductIdentifiers[];

    constructor(props?: OrderProducts) {

        this.order_products = props?.order_products || null;

    }

}



export class OrderTypeSearch extends Order {

    order_products: OrderProductIdentifiers[];

    // actions for dataTable
    actions_custom_field_printOrder?: any;
    actions_custom_field_previewOrder?: any;
    actions_custom_field_completeOrder?: any;
    actions_custom_field_editOrder?: any;

    constructor(props?: OrderTypeSearch) {

        super(props);
        this.order_products = props?.order_products || null;

    }

}



export class NewUpdateOrder extends Order {

    order_products: OrderProductIdentifiers[];

    constructor(props?: NewUpdateOrder) {

        super(props);
        this.order_products = props?.order_products || null;

    }

}



export interface GraphQLSearchOrdersParamsArgs {

    order_id?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    phone?: string;
    cell_phone?: string;
    confirmed?: boolean;
    sent?: boolean;
    completed?: boolean;
    transfer_courier?: string;
    current_status?: string;
    invoice_data__company?: string;
    invoice_data__tax_number?: string;
    invoice_data__doy?: string;
    invoice_data__address?: string;
    invoice_data__postal_code?: string;
    invoice_data__city?: string;
    invoice_data__country?: string;
    invoice_data__phone?: string;
    invoice_data__cell_phone?: string;
    invoice_data__is_valid?: boolean;
    payment_type?: string;
    connected_account_id: string;                   // not optional
    order_number?: string;
    invoice_data__invoice_number?: string;

}




export class SpecificListOrdersParams {

    address?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    transfer_courier?: string;
    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned';
    page?: number;


    constructor(props?: SpecificListOrdersParams) {
        this.address = props?.address || null;
        this.postal_code = props?.postal_code || null;
        this.city = props?.city || null;
        this.country = props?.country || null;
        this.transfer_courier = props?.transfer_courier || null;
        this.current_status = props?.current_status || null;
        this.page = Number(props?.page) || null;
    }

}

