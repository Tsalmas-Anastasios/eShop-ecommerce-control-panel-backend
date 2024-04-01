export interface OrderCancelledMailData {

    shop_logo: string;
    shop_url: string;
    first_name: string;
    last_name: string;
    order_number: string;
    shop_name: string;
    shop_google_rate_url: string;
    date_time?: string | Date;

}


export interface OrderCancelledByCustomerMailData {

    shop_logo: string;
    shop_url: string;
    shop_name: string;
    shop_google_rate_url: string;
    first_name: string;
    last_name: string;
    order_number: string;

}
