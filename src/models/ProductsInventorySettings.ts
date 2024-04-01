export class ProductsInventoriesSettings {

    auto_generation_timeline: ProductInventoriesSettingsAutoGenerationTimeline;

    // not in db
    connected_account_id?: string;

    constructor(props?: ProductsInventoriesSettings) {

        this.auto_generation_timeline = props?.auto_generation_timeline || new ProductInventoriesSettingsAutoGenerationTimeline();

        // not in db
        this.connected_account_id = props?.connected_account_id || null;

    }

}





export class ProductInventoriesSettingsAutoGenerationTimeline {

    setting_id: number;
    connected_account_id: string;
    type: string;
    value?: string;
    setting_auto_generate_date__day?: string;
    setting_auto_generate_date__month?: string;
    setting_auto_generate_date_frequency?: 'yearly' | 'monthly' | 'weekly' | 'daily';
    setting_auto_generate_date_frequency__day?: string;
    setting_auto_generate_date_frequency__month?: string;
    meta?: any;

    constructor(props?: ProductInventoriesSettingsAutoGenerationTimeline) {

        this.setting_id = props?.setting_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.type = props?.type || null;
        this.value = props?.value || null;
        this.setting_auto_generate_date__day = props?.setting_auto_generate_date__day || null;
        this.setting_auto_generate_date__month = props?.setting_auto_generate_date__month || null;
        this.setting_auto_generate_date_frequency = props?.setting_auto_generate_date_frequency || null;
        this.setting_auto_generate_date_frequency__day = props?.setting_auto_generate_date_frequency__day || null;
        this.setting_auto_generate_date_frequency__month = props?.setting_auto_generate_date_frequency__month || null;
        this.meta = props?.meta ? JSON.parse(props.meta) : null;

    }

}
