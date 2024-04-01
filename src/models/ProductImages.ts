export class ProductImage {

    id?: string;
    url: string;
    main_image: boolean;
    product_id?: string;
    archived: boolean;
    created_at?: string | Date;
    connected_account_id?: string;
    product_version?: string;

    constructor(props?: ProductImage) {

        this.id = props?.id || null;
        this.url = props?.url || null;
        this.main_image = props?.main_image || null;
        this.product_id = props?.product_id || null;
        this.archived = props?.archived || null;
        this.created_at = props?.created_at || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.product_version = props?.product_version || null;

    }

}



export class SaveNewProductImage {

    filename?: string;
    product_id: string;
    main_image?: number;
    archived?: boolean;
    connected_account_id: string;
    product_version?: string;

    constructor(props?: SaveNewProductImage) {

        this.filename = props?.filename || null;
        this.product_id = props?.product_id || null;
        this.main_image = props?.main_image || null;
        this.archived = props?.archived || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.product_version = props?.product_version || null;

    }

}
