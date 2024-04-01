import { ProductImage } from './ProductImages';
import { style } from '../lib/email-templates/config';

export class Product {

    product_id?: string;
    headline: string;
    product_brand: string;
    categories_belongs: any;
    product_code?: string;
    product_model: string;
    stock: number;
    supplied_price: number;
    clear_price: number;                // price that the store sell the product (without taxes and fees)
    fee_percent: number;
    fees: number;
    discount_percent: number;
    discount: number;

    specification: ProductSpecificationCategory[];

    product_description: string;
    supplier: string;
    current_status?:
        'in_stock'
        | 'available_1_to_3_days'
        | 'available_1_to_10_days'
        | 'available_1_to_30_days'
        | 'with_order'
        | 'unavailable'
        | 'temporary_unavailable'
        | 'out_of_stock'
        | 'ended'
        | 'closed';
    archived?: boolean;
    notes?: string;
    connected_account_id?: string;
    created_at_epoch?: number;
    created_at?: string | Date;
    current_version?: string;
    product_shared?: boolean;


    // not in db
    images?: ProductImage[];
    product_stock?: ProductStock[];

    constructor(props?: Product) {

        this.product_id = props?.product_id || null;
        this.headline = props?.headline || null;
        this.product_brand = props?.product_brand || null;
        this.categories_belongs = JSON.stringify(props?.categories_belongs) || null;
        this.product_code = props?.product_code || null;
        this.product_model = props?.product_model || null;
        this.stock = props?.stock || null;
        this.supplied_price = props?.supplied_price || null;
        this.clear_price = props?.clear_price || null;
        this.fee_percent = props?.fee_percent || null;
        this.fees = props?.fees || null;
        this.discount_percent = props?.discount_percent || 0;
        this.discount = props?.discount || 0;

        this.specification = props?.specification || [];

        this.product_description = props?.product_description || null;
        this.supplier = props?.supplier || null;
        this.current_status = props?.current_status || 'in_stock';
        this.archived = props?.archived || false;
        this.notes = props?.notes || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.created_at_epoch = props?.created_at_epoch || null;
        this.created_at = props?.created_at || null;
        this.current_status = props?.current_status || null;
        this.product_shared = props?.product_shared ? true : false;


        // not in db
        // this.images = props?.images || [{ 'url': style.logo.control_panel, main_image: true, product_id: this.product_id, archived: false, created_at: new Date() }];
        this.images = props?.images || [];
        this.product_stock = props?.product_stock || [];

    }




    // calculate the total product stock
    public calculateProductStock(productStockObj: ProductStock[]): number {

        let total_stock = 0;

        for (const stock of productStockObj)
            total_stock += stock.stock_quantity;


        return total_stock;

    }


}








// specification
export class ProductSpecificationCategory {

    id?: string;
    category_name: string;
    product_id?: string;
    connected_account_id?: string;
    product_version?: string;

    // extras
    fields: ProductSpecificationField[];

    constructor(props?: ProductSpecificationCategory) {

        this.id = props?.id || null;
        this.category_name = props?.category_name || null;
        this.product_id = props?.product_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.product_version = props?.product_version || null;

        // extras
        this.fields = props?.fields || [];

    }

}


export class ProductSpecificationField {

    id?: string;
    specification_field_name: string;
    specification_field_value: string;
    specification_category_id?: string;
    product_id?: string;
    connected_account_id?: string;
    product_version?: string;

    constructor(props?: ProductSpecificationField) {

        this.id = props?.id || null;
        this.specification_field_name = props?.specification_field_name || null;
        this.specification_field_value = props?.specification_field_value || null;
        this.specification_category_id = props?.specification_category_id || null;
        this.product_id = props?.product_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.product_version = props?.product_version || null;

    }

}







export interface GraphQlSearchProductsParamsArgs {

    product_id?: string;
    headline?: string;
    product_brand?: string;
    categories_belongs?: string;
    product_code?: string;
    product_model?: string;
    supplier?: string;
    current_status?:
    'in_stock'
    | 'available_1_to_3_days'
    | 'available_1_to_10_days'
    | 'available_1_to_30_days'
    | 'with_order'
    | 'unavailable'
    | 'temporary_unavailable'
    | 'out_of_stock'
    | 'ended'
    | 'closed';
    connected_account_id?: string;

}



export interface GraphQlSearchProductsParamsArgsSpecificList {

    product_brand?: string;
    categories_belongs?: string;
    product_model?: string;
    supplier?: string;
    current_status?: string;
    page?: number;

    connected_account_id?: string;

}



export interface GraphQlSearchProductsParamsArgsSpecificProduct {

    product_id?: string;
    product_code?: string;

}





export class ProductHistory extends Product {

    rec_id?: string;
    version?: string;
    version__created_at_epoch?: number;
    version__created_at?: string | Date;

    constructor(props?: ProductHistory) {

        super(props);

        this.rec_id = props?.rec_id || null;
        this.version = props?.version || null;
        this.version__created_at_epoch = props?.version__created_at_epoch || null;
        this.version__created_at = props?.version__created_at || null;

    }

}






export class ProductWithCategoryLabel {

    category_name: string;
    products: Product[];

    constructor(props?: ProductWithCategoryLabel) {
        this.category_name = props?.category_name || null;
        this.products = props?.products || [];
    }

}






// class for the product stock
export class ProductStock {

    rec_id?: string;
    product_id?: string;
    connected_account_id?: string;
    warehouse_id: string;
    runway_id: string;
    column_id: string;
    column_shelf_id: string;
    stock_quantity: number;

    constructor(props?: ProductStock) {

        this.rec_id = props?.rec_id || null;
        this.product_id = props?.product_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.warehouse_id = props?.warehouse_id || null;
        this.runway_id = props?.runway_id || null;
        this.column_id = props?.column_id || null;
        this.column_shelf_id = props?.column_shelf_id || null;
        this.stock_quantity = props?.stock_quantity || 0;

    }

}
