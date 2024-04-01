export interface OrderSummaryData {

    all_orders?: number;
    confirmed_orders?: number;
    sent_orders?: number;
    completed_orders?: number;
    archived_orders?: number;
    returned_orders?: number;

}



export class OrderSummaryDataAllTypes {

    general_type: OrderSummaryData;
    yearly_type: OrderSummaryData;
    monthly_type: OrderSummaryData;
    weekly_type: OrderSummaryData;
    range_type: OrderSummaryData;
    day_type: OrderSummaryData;

    constructor(props?: OrderSummaryDataAllTypes) {

        this.general_type = props?.general_type || null;
        this.yearly_type = props?.yearly_type || null;
        this.monthly_type = props?.monthly_type || null;
        this.weekly_type = props?.weekly_type || null;

    }

}


