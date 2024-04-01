export interface OrderChangesAppliedMail {

    order_id: string;
    connected_account: string;

    shop_logo: string;
    shop_url: string;
    first_name: string;
    last_name: string;
    order_number: string;
    shop_name: string;
    shop_google_rate_url: string;

    // order details here
    billing__address: string;
    billing__city: string;
    billing__postal_code: string;
    billing__country: string;
    billing__phone_number: string;
    billing__first_name: string;
    billing__last_name: string;
    delivery__address: string;
    delivery__city: string;
    delivery__postal_code: string;
    delivery__country: string;
    delivery__phone_number: string;
    delivery__first_name: string;
    delivery__last_name: string;

    // html for the products
    products: string;

}
