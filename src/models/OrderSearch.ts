export class OrderSearchParams {

    order_id?: string;
    order_number?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
    connected_account_id?: string;
    page?: number;
    limit: number;

    constructor(props?: OrderSearchParams) {

        this.order_id = props?.order_id || null;
        this.order_number = props?.order_number || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.phone = props?.phone || null;
        this.email = props?.email || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.page = props?.page || 1;
        this.limit = props?.limit || 10;

    }

}




export class PromiseOrdersModeling {

    order_id: string;
    order_number: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    confirm_date: string | Date;
    order_total: number;

    constructor(props?: PromiseOrdersModeling) {

        this.order_id = props?.order_id;
        this.order_number = props?.order_number;
        this.first_name = props?.first_name;
        this.last_name = props?.last_name;
        this.phone = props?.phone;
        this.email = props?.email;
        this.confirm_date = props?.confirm_date;
        this.order_total = props?.order_total;

    }

}
