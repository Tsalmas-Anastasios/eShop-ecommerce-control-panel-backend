export class ProductInventoryMainData {

    inventory_id: string;
    connected_account_id: string;
    descriptive_title: string;
    created_at: string | Date;
    created_by__user_id: string;
    created_by__first_name: string;
    created_by__last_name: string;


    // not in db
    products?: ProductInventoryProductData[];

    constructor(props?: ProductInventoryMainData) {

        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.created_at = props?.created_at || null;
        this.created_by__user_id = props?.created_by__user_id || null;
        this.created_by__first_name = props?.created_by__first_name || null;
        this.created_by__last_name = props?.created_by__last_name || null;


        // not in db
        this.products = props?.products || [];

    }

}





export class ProductInventoryProductData {

    rec_product_id: string;
    inventory_id: string;
    connected_account_id: string;
    product_id: string;
    product_headline: string;
    product_brand: string;
    product_model: string;
    product_code: string;
    inventory_product_stock: number;


    // not in db
    warehouses?: ProductInventoryProductWarehouseData[];

    constructor(props?: ProductInventoryProductData) {

        this.rec_product_id = props?.rec_product_id || null;
        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.product_id = props?.product_id || null;
        this.product_headline = props?.product_headline || null;
        this.product_brand = props?.product_brand || null;
        this.product_model = props?.product_model || null;
        this.product_code = props?.product_code || null;
        this.inventory_product_stock = props?.inventory_product_stock || 0;


        // not in db
        this.warehouses = props?.warehouses || [];

    }

}



export class ProductInventoryProductWarehouseData {

    rec_id: string;
    inventory_id: string;
    connected_account_id: string;
    rec_product_id: string;
    warehouse_id: string;
    warehouse_distinctive_title: string;
    warehouse_code_name: string;
    warehouse_total_stock: number;


    // not in db
    runways?: ProductInventoryProductWarehouseRunwaysData[];

    constructor(props?: ProductInventoryProductWarehouseData) {

        this.rec_id = props?.rec_id || null;
        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.rec_product_id = props?.rec_product_id || null;
        this.warehouse_id = props?.warehouse_id || null;
        this.warehouse_distinctive_title = props?.warehouse_distinctive_title || null;
        this.warehouse_code_name = props?.warehouse_code_name || null;
        this.warehouse_total_stock = props?.warehouse_total_stock || 0;


        // not in db
        this.runways = props?.runways || [];

    }

}





export class ProductInventoryProductWarehouseRunwaysData {

    rec_id: string;
    inventory_id: string;
    connected_account_id: string;
    rec_product_id: string;
    rec_warehouse_id: string;
    runway_id: string;
    runway_name: string;
    runway_code: string;
    runway_total_stock: number;


    // not in db
    columns?: ProductInventoryProductWarehouseRunwaysColumnsData[];

    constructor(props?: ProductInventoryProductWarehouseRunwaysData) {

        this.rec_id = props?.rec_id || null;
        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.rec_product_id = props?.rec_product_id || null;
        this.rec_warehouse_id = props?.rec_warehouse_id || null;
        this.runway_id = props?.runway_id || null;
        this.runway_name = props?.runway_name || null;
        this.runway_code = props?.runway_code || null;
        this.runway_total_stock = props?.runway_total_stock || 0;


        // not in db
        this.columns = props?.columns || [];

    }

}




export class ProductInventoryProductWarehouseRunwaysColumnsData {

    rec_id: string;
    inventory_id: string;
    connected_account_id: string;
    rec_product_id: string;
    rec_warehouse_id: string;
    rec_runway_id: string;
    column_id: string;
    column_name: string;
    column_code: string;
    column_total_stock: number;


    // not in db
    shelf?: ProductInventoryProductWarehouseRunwaysColumnsShelfData[];

    constructor(props?: ProductInventoryProductWarehouseRunwaysColumnsData) {

        this.rec_id = props?.rec_id || null;
        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.rec_product_id = props?.rec_product_id || null;
        this.rec_warehouse_id = props?.rec_warehouse_id || null;
        this.rec_runway_id = props?.rec_runway_id || null;
        this.column_id = props?.column_id || null;
        this.column_name = props?.column_name || null;
        this.column_code = props?.column_code || null;
        this.column_total_stock = props?.column_total_stock || 0;


        // not in db
        this.shelf = props?.shelf || [];

    }

}



export class ProductInventoryProductWarehouseRunwaysColumnsShelfData {

    rec_id: string;
    inventory_id: string;
    connected_account_id: string;
    rec_product_id: string;
    rec_warehouse_id: string;
    rec_runway_id: string;
    rec_column_id: string;
    shelf_id: string;
    shelf_code: string;
    shelf_total_stock: number;

    constructor(props?: ProductInventoryProductWarehouseRunwaysColumnsShelfData) {

        this.rec_id = props?.rec_id || null;
        this.inventory_id = props?.inventory_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.rec_product_id = props?.rec_product_id || null;
        this.rec_warehouse_id = props?.rec_warehouse_id || null;
        this.rec_runway_id = props?.rec_runway_id || null;
        this.rec_column_id = props?.rec_column_id || null;
        this.shelf_id = props?.shelf_id || null;
        this.shelf_code = props?.shelf_code || null;
        this.shelf_total_stock = props?.shelf_total_stock || 0;

    }

}
