import { ProductImage } from './ProductImages';

export class PromiseProductsModeling {

    product_id: string;
    headline: string;
    product_brand: string;
    categories_belongs: string;
    product_code: string;
    product_model: string;
    stock: string;
    clear_price: number;
    fee_percent: number;
    fees: number;
    current_status: number;


    images: ProductImage[];
    main_image: string;

    constructor(props?: PromiseProductsModeling) {

        this.product_id = props?.product_id || null;
        this.headline = props?.headline || null;
        this.product_brand = props?.product_brand || null;
        this.categories_belongs = props?.categories_belongs || null;
        this.product_code = props?.product_code || null;
        this.product_model = props?.product_model || null;
        this.stock = props?.stock || null;
        this.clear_price = props?.clear_price || null;
        this.fee_percent = props?.fee_percent || null;
        this.fees = props?.fees || null;
        this.current_status = props?.current_status || null;

        this.images = props?.images || null;
        this.main_image = props?.main_image || null;

    }

}




export class ProductSearchParams {

    product_code?: string;
    headline?: string;
    product_brand?: string;
    product_model?: string;
    connected_account_id?: string;
    page?: number;
    limit?: number;

    constructor(props?: ProductSearchParams) {

        this.product_code = props?.product_code || null;
        this.headline = props?.headline || null;
        this.product_brand = props?.product_brand || null;
        this.product_model = props?.product_model || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.page = props?.page || 1;
        this.limit = props?.limit || 10;

    }

}
