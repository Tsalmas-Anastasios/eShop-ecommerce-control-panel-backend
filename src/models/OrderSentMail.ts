import { ProductImage } from './ProductImages';


export interface OrderSentStandardMailData {
    address: string;
    postal_code: string;
    city: string;
    country: string;
    phone: string;

    invoice_data__first_name?: string;
    invoice_data__last_name?: string;
    invoice_data__address?: string;
    invoice_data__postal_code?: string;
    invoice_data__city?: string;
    invoice_data__country?: string;
    invoice_data__phone?: string;

    tracking_url: string;
    tracking_number: string;
}

export interface OrderSentMailData extends OrderSentStandardMailData {

    order_id: string;
    connected_account: string;

    shop_logo: string;
    shop_url: string;
    first_name: string;
    last_name: string;
    order_number: string;
    shop_name: string;
    shop_google_rate_url: string;

    // html for the products
    products: string;

}



export interface OrderSentMailDataProduct {

    product_id: string;
    order_id: string;
    quantity: number;
    supplied_customer_price: string;
    connected_account_id: string;

    product_info: {
        headline: string;
        product_brand: string;
        product_model: string;
        product_code: string;
    };

    images: ProductImage[];

}




export class OrderImportantData {

    order_id?: string;
    order_number?: string;
    connected_account_id: string;

    constructor(props?: OrderImportantData) {

        this.order_id = props?.order_id || null;
        this.order_number = props?.order_number || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}
