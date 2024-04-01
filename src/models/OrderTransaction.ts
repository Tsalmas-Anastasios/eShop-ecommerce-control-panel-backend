export class OrderTransaction {

    rec_id?: string;
    order_id?: string;
    connected_account_id: string;
    updated_by: string;
    order_created_at?: string | Date;
    order_seen?: boolean;
    whole_order_updated?: boolean;
    status_updated?: boolean;
    status_before?: string;
    status_after?: string;
    field_changed?: string;
    value_before?: string;
    value_after?: string;
    created_at?: string | Date;

    constructor(props?: OrderTransaction) {

        this.rec_id = props?.rec_id || null;
        this.order_id = props?.order_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.updated_by = props?.updated_by || null;
        this.order_created_at = props?.order_created_at || null;
        this.order_seen = props?.order_seen ? true : false;
        this.whole_order_updated = props?.whole_order_updated ? true : false;
        this.status_updated = props?.status_updated ? true : false;
        this.status_before = props?.status_before || null;
        this.status_after = props?.status_after || null;
        this.field_changed = props?.field_changed || null;
        this.value_before = props?.value_before || null;
        this.value_after = props?.value_after || null;
        this.created_at = props?.created_at || null;

    }

}
