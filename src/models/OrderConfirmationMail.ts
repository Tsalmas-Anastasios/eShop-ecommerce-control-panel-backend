export interface OrderConfirmationMailUsedData {

    shop_logo: string;                  // from db
    shop_url: string;                   // from db
    first_name: string;
    last_name: string;
    order_number: string;
    shop_name: string;                  // from db
    shop_google_rate_url: string;      // from db

}


export class OrderConfirmationMailUsedDataCompanyBasicData {

    shop_logo: string;                  // from db
    shop_url: string;                   // from db
    shop_name: string;                  // from db
    shop_google_rate_url: string;      // from db

    constructor(props?: OrderConfirmationMailUsedDataCompanyBasicData) {

        this.shop_logo = props?.shop_logo || null;
        this.shop_url = props?.shop_url || null;
        this.shop_name = props?.shop_name || null;
        this.shop_google_rate_url = props?.shop_google_rate_url || null;

    }

}
