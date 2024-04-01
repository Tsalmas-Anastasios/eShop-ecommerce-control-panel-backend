export class OrderPaymentMethod {

    rec_id?: string;
    label: string;
    description: string;
    service: string;
    active?: boolean;
    archived?: boolean;


    constructor(props?: OrderPaymentMethod) {

        this.rec_id = props?.rec_id || null;
        this.label = props?.label || null;
        this.description = props?.description || null;
        this.service = props?.service || null;
        this.active = props?.active || null;
        this.archived = props?.archived || null;

    }

}
