export class ProductCategory {

    pcategory_id?: string;
    label?: string;
    connected_account_id: string;

    constructor(props?: ProductCategory) {

        this.pcategory_id = props?.pcategory_id || null;
        this.label = props?.label || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}
