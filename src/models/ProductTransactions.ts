export class ProductTransaction {

    rec_id?: number;
    product_id: string;
    connected_account_id: string;
    updated_by: string;
    product_created_at?: string | Date;
    whole_product_update?: boolean;
    product_update_categories?: boolean;
    added_category?: string;
    removed_category?: string;
    product_update_images?: boolean;
    field_changed?: string;
    value_before?: string;
    value_after?: string;
    quantity_sold?: number;
    quantity_added?: number;
    quantity_removed?: number;
    warehouse_id?: string;
    runway_id?: string;
    column_id?: string;
    column_shelf_id?: string;
    purchased_price?: number;
    status_changed?: boolean;
    status_before?: string;
    status_after?: string;
    created_at?: string | Date;

    constructor(props?: ProductTransaction) {

        this.rec_id = props?.rec_id || null;
        this.product_id = props?.product_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.updated_by = props?.updated_by || null;
        this.product_created_at = props?.product_created_at || null;
        this.whole_product_update = props?.whole_product_update ? true : false;
        this.product_update_categories = props?.product_update_categories ? true : false;
        this.added_category = props?.added_category || null;
        this.removed_category = props?.removed_category || null;
        this.product_update_images = props?.product_update_images ? true : false;
        this.field_changed = props?.field_changed || null;
        this.value_before = props?.value_before || null;
        this.value_after = props?.value_after || null;
        this.quantity_sold = props?.quantity_sold || 0;
        this.quantity_added = props?.quantity_added || 0;
        this.quantity_removed = props?.quantity_removed || 0;
        this.warehouse_id = props?.warehouse_id || null;
        this.runway_id = props?.runway_id || null;
        this.column_id = props?.column_id || null;
        this.column_shelf_id = props?.column_shelf_id || null;
        this.purchased_price = props?.purchased_price || 0;
        this.status_changed = props?.status_changed ? true : false;
        this.status_before = props?.status_before || null;
        this.status_after = props?.status_after || null;
        this.created_at = props?.created_at || new Date();

    }

}
