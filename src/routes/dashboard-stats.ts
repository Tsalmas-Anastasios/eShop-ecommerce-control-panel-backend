import { Application, Request, Response, request } from 'express';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';

import { DashboardStats, DashboardStatsOrdersPerMonths, DashboardStatsMonths } from '../models';
import { getDashboardStatsTotalSalesAmountService, getDashboardStatsOrdersService } from '../lib/dashboard-stats.service';





export class DashboardStatsRoutes {


    public routes(server: Application) {


        server.route('/api/dashboard/stats/all')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);



                    // const incomes = await getDashboardStatsTotalSalesAmountService.getIncomesMonthlyAndBefore(account_id);
                    // const orders_current_before_month = await getDashboardStatsOrdersService.getOrderMonthlyAndBefore(account_id);
                    // const monthly_orders_all_statuses = await getDashboardStatsOrdersService.getOrderMonthlyByStatus(account_id);
                    // const order_analytics = await getDashboardStatsOrdersService.getOrderAnalyticsAllMonths(account_id);
                    // const total_sales_per_month = await getDashboardStatsTotalSalesAmountService.getTotalSalesPerMonth(account_id);


                    const [incomes, orders_current_before_month, monthly_orders_all_statuses, order_analytics, total_sales_per_month] = await Promise.all([
                        getDashboardStatsTotalSalesAmountService.getIncomesMonthlyAndBefore(account_id),
                        getDashboardStatsOrdersService.getOrderMonthlyAndBefore(account_id),
                        getDashboardStatsOrdersService.getOrderMonthlyByStatus(account_id),
                        getDashboardStatsOrdersService.getOrderAnalyticsAllMonths(account_id),
                        getDashboardStatsTotalSalesAmountService.getTotalSalesPerMonth(account_id),
                    ]);


                    return res.status(200).send({
                        code: 200,
                        type: 'dashboard_stats',
                        message: 'New dashboard stats, e-Commerce Bizyhive Control Panel',
                        stats: {
                            incomes: {
                                current_month: incomes.current_month,
                                last_month: incomes.before_month,
                                difference: {
                                    total_sales_reduce_up_or_down: incomes.current_month > incomes.before_month ? 'up' : incomes.current_month < incomes.before_month ? 'down' : 'static',
                                    total_sales_reduce_month: Math.abs(incomes.current_month - incomes.before_month),
                                },
                                month_analysis: {
                                    ...total_sales_per_month
                                }
                            },
                            orders: {
                                current_month: orders_current_before_month.current_month,
                                last_month: orders_current_before_month.last_month,
                                difference: {
                                    orders_summary_reduce_up_or_down: orders_current_before_month.current_month > orders_current_before_month.last_month ? 'up' : orders_current_before_month.last_month > orders_current_before_month.current_month ? 'down' : 'static',
                                    orders_summary_reduce_month: Math.abs(orders_current_before_month.current_month - orders_current_before_month.last_month),
                                },
                                monthly_by_status: {
                                    ...monthly_orders_all_statuses
                                },
                                analytics: {
                                    per_month: { ...order_analytics },
                                    per_status: {
                                        total_orders: {
                                            january: order_analytics.january.total_orders,
                                            february: order_analytics.february.total_orders,
                                            march: order_analytics.march.total_orders,
                                            april: order_analytics.april.total_orders,
                                            may: order_analytics.may.total_orders,
                                            june: order_analytics.june.total_orders,
                                            july: order_analytics.july.total_orders,
                                            august: order_analytics.august.total_orders,
                                            september: order_analytics.september.total_orders,
                                            october: order_analytics.october.total_orders,
                                            november: order_analytics.november.total_orders,
                                            december: order_analytics.december.total_orders
                                        },
                                        confirmed_orders: {
                                            january: order_analytics.january.confirmed_orders,
                                            february: order_analytics.february.confirmed_orders,
                                            march: order_analytics.march.confirmed_orders,
                                            april: order_analytics.april.confirmed_orders,
                                            may: order_analytics.may.confirmed_orders,
                                            june: order_analytics.june.confirmed_orders,
                                            july: order_analytics.july.confirmed_orders,
                                            august: order_analytics.august.confirmed_orders,
                                            september: order_analytics.september.confirmed_orders,
                                            october: order_analytics.october.confirmed_orders,
                                            november: order_analytics.november.confirmed_orders,
                                            december: order_analytics.december.confirmed_orders
                                        },
                                        sent_orders: {
                                            january: order_analytics.january.sent_orders,
                                            february: order_analytics.february.sent_orders,
                                            march: order_analytics.march.sent_orders,
                                            april: order_analytics.april.sent_orders,
                                            may: order_analytics.may.sent_orders,
                                            june: order_analytics.june.sent_orders,
                                            july: order_analytics.july.sent_orders,
                                            august: order_analytics.august.sent_orders,
                                            september: order_analytics.september.sent_orders,
                                            october: order_analytics.october.sent_orders,
                                            november: order_analytics.november.sent_orders,
                                            december: order_analytics.december.sent_orders
                                        },
                                        completed_orders: {
                                            january: order_analytics.january.completed_orders,
                                            february: order_analytics.february.completed_orders,
                                            march: order_analytics.march.completed_orders,
                                            april: order_analytics.april.completed_orders,
                                            may: order_analytics.may.completed_orders,
                                            june: order_analytics.june.completed_orders,
                                            july: order_analytics.july.completed_orders,
                                            august: order_analytics.august.completed_orders,
                                            september: order_analytics.september.completed_orders,
                                            october: order_analytics.october.completed_orders,
                                            november: order_analytics.november.completed_orders,
                                            december: order_analytics.december.completed_orders
                                        },
                                        archived_orders: {
                                            january: order_analytics.january.archived_orders,
                                            february: order_analytics.february.archived_orders,
                                            march: order_analytics.march.archived_orders,
                                            april: order_analytics.april.archived_orders,
                                            may: order_analytics.may.archived_orders,
                                            june: order_analytics.june.archived_orders,
                                            july: order_analytics.july.archived_orders,
                                            august: order_analytics.august.archived_orders,
                                            september: order_analytics.september.archived_orders,
                                            october: order_analytics.october.archived_orders,
                                            november: order_analytics.november.archived_orders,
                                            december: order_analytics.december.archived_orders
                                        },
                                        returned_orders: {
                                            january: order_analytics.january.returned_orders,
                                            february: order_analytics.february.returned_orders,
                                            march: order_analytics.march.returned_orders,
                                            april: order_analytics.april.returned_orders,
                                            may: order_analytics.may.returned_orders,
                                            june: order_analytics.june.returned_orders,
                                            july: order_analytics.july.returned_orders,
                                            august: order_analytics.august.returned_orders,
                                            september: order_analytics.september.returned_orders,
                                            october: order_analytics.october.returned_orders,
                                            november: order_analytics.november.returned_orders,
                                            december: order_analytics.december.returned_orders
                                        }
                                    }
                                }
                            }
                        }
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }


            });


    }


}
