-- u598963739_control_panel.product_inventories_products_warehouses_columns_shelf definition

CREATE TABLE `product_inventories_products_warehouses_columns_shelf` (
  `rec_id` varchar(10) NOT NULL,
  `inventory_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `rec_product_id` varchar(64) NOT NULL,
  `rec_warehouse_id` varchar(64) NOT NULL,
  `rec_runway_id` varchar(64) NOT NULL,
  `rec_column_id` varchar(64) NOT NULL,
  `shelf_id` varchar(48) NOT NULL,
  `shelf_code` varchar(50) NOT NULL,
  `shelf_total_stock` int(11) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `products_warehouses_columns_shelf_accounts_FK` (`connected_account_id`),
  KEY `products_warehouses_columns_shelf_product_inventory_overview_FK` (`inventory_id`),
  KEY `warehouses_columns_shelf_product_inventories_products_FK` (`rec_product_id`),
  KEY `columns_shelf_product_inventories_products_warehouses_FK` (`rec_warehouse_id`),
  KEY `products_warehouses_runways_FK2` (`rec_runway_id`),
  KEY `products_warehouses_columns_FK2` (`rec_column_id`),
  CONSTRAINT `columns_shelf_product_inventories_products_warehouses_FK` FOREIGN KEY (`rec_warehouse_id`) REFERENCES `product_inventories_products_warehouses` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_warehouses_columns_FK2` FOREIGN KEY (`rec_column_id`) REFERENCES `product_inventories_products_warehouses_columns` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_warehouses_columns_shelf_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_warehouses_columns_shelf_product_inventory_overview_FK` FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory_overview` (`inventory_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_warehouses_runways_FK2` FOREIGN KEY (`rec_runway_id`) REFERENCES `product_inventories_products_warehouses_runways` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `warehouses_columns_shelf_product_inventories_products_FK` FOREIGN KEY (`rec_product_id`) REFERENCES `product_inventories_products` (`rec_product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves all the data and metadata for the products that been recorded into the product inventories. Saves the columns that a product belongs to.';