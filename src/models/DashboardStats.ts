export class DashboardStats {

    monthly_incomes: number;
    before_month_incomes: number;
    monthly_total_orders: number;
    before_month_total_orders: number;
    monthly_pending_orders: number;
    monthly_sent_orders: number;
    monthly_completed_orders: number;
    monthly_archived_orders: number;
    monthly_returned_orders: number;
    orders_analytics: DashboardStatsOrdersPerMonths;
    total_sales: DashboardStatsMonths;

    constructor(props?: DashboardStats) {

        this.monthly_incomes = props?.monthly_incomes || 0;
        this.before_month_incomes = props?.before_month_incomes || 0;
        this.monthly_total_orders = props?.monthly_total_orders || 0;
        this.before_month_total_orders = props?.before_month_total_orders || 0;
        this.monthly_pending_orders = props?.monthly_pending_orders || 0;
        this.monthly_sent_orders = props?.monthly_sent_orders || 0;
        this.monthly_completed_orders = props?.monthly_completed_orders || 0;
        this.monthly_archived_orders = props?.monthly_archived_orders || 0;
        this.monthly_returned_orders = props?.monthly_returned_orders || 0;
        this.orders_analytics = props?.orders_analytics || new DashboardStatsOrdersPerMonths();
        this.total_sales = props?.total_sales || new DashboardStatsMonths();

    }

}



export class DashboardStatsOrdersPerMonths {

    total_orders: DashboardStatsMonths;
    completed_orders: DashboardStatsMonths;
    archived_orders: DashboardStatsMonths;
    returned_orders: DashboardStatsMonths;

    constructor(props?: DashboardStatsOrdersPerMonths) {

        this.total_orders = props?.total_orders || new DashboardStatsMonths();
        this.completed_orders = props?.completed_orders || new DashboardStatsMonths();
        this.archived_orders = props?.archived_orders || new DashboardStatsMonths();
        this.returned_orders = props?.returned_orders || new DashboardStatsMonths();

    }

}




export class DashboardStatsMonths {

    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;

    constructor(props?: DashboardStatsMonths) {

        this.january = props?.january || 0;
        this.february = props?.february || 0;
        this.march = props?.march || 0;
        this.april = props?.april || 0;
        this.may = props?.may || 0;
        this.june = props?.june || 0;
        this.july = props?.july || 0;
        this.august = props?.august || 0;
        this.september = props?.september || 0;
        this.october = props?.october || 0;
        this.november = props?.november || 0;
        this.december = props?.december || 0;

    }

}









export class DashboardStatsOrderAnalyticsStatuses {

    confirmed_orders: number;
    sent_orders: number;
    completed_orders: number;
    archived_orders: number;
    returned_orders: number;
    total_orders: number;

    constructor(props?: DashboardStatsOrderAnalyticsStatuses) {

        this.confirmed_orders = props?.confirmed_orders || 0;
        this.sent_orders = props?.sent_orders || 0;
        this.completed_orders = props?.completed_orders || 0;
        this.archived_orders = props?.archived_orders || 0;
        this.returned_orders = props?.returned_orders || 0;
        this.total_orders = props?.total_orders || 0;

    }
}




export class DashboardStatsOrderAnalyticsMonths {

    january: DashboardStatsOrderAnalyticsStatuses;
    february: DashboardStatsOrderAnalyticsStatuses;
    march: DashboardStatsOrderAnalyticsStatuses;
    april: DashboardStatsOrderAnalyticsStatuses;
    may: DashboardStatsOrderAnalyticsStatuses;
    june: DashboardStatsOrderAnalyticsStatuses;
    july: DashboardStatsOrderAnalyticsStatuses;
    august: DashboardStatsOrderAnalyticsStatuses;
    september: DashboardStatsOrderAnalyticsStatuses;
    october: DashboardStatsOrderAnalyticsStatuses;
    november: DashboardStatsOrderAnalyticsStatuses;
    december: DashboardStatsOrderAnalyticsStatuses;

    constructor(props?: DashboardStatsOrderAnalyticsMonths) {

        this.january = props?.january || new DashboardStatsOrderAnalyticsStatuses();
        this.february = props?.february || new DashboardStatsOrderAnalyticsStatuses();
        this.march = props?.march || new DashboardStatsOrderAnalyticsStatuses();
        this.april = props?.april || new DashboardStatsOrderAnalyticsStatuses();
        this.may = props?.may || new DashboardStatsOrderAnalyticsStatuses();
        this.june = props?.june || new DashboardStatsOrderAnalyticsStatuses();
        this.july = props?.july || new DashboardStatsOrderAnalyticsStatuses();
        this.august = props?.august || new DashboardStatsOrderAnalyticsStatuses();
        this.september = props?.september || new DashboardStatsOrderAnalyticsStatuses();
        this.october = props?.october || new DashboardStatsOrderAnalyticsStatuses();
        this.november = props?.november || new DashboardStatsOrderAnalyticsStatuses();
        this.december = props?.december || new DashboardStatsOrderAnalyticsStatuses();

    }

}
