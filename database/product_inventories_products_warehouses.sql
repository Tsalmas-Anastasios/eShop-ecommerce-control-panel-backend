-- u598963739_control_panel.product_inventories_products_warehouses definition

CREATE TABLE `product_inventories_products_warehouses` (
  `rec_id` varchar(64) NOT NULL COMMENT 'format: chars(64)',
  `inventory_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `rec_product_id` varchar(64) NOT NULL,
  `warehouse_id` varchar(48) NOT NULL,
  `warehouse_distinctive_title` varchar(254) NOT NULL,
  `warehouse_code_name` varchar(100) NOT NULL,
  `warehouse_total_stock` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_id`),
  KEY `product_inventories_products_warehouses_accounts_FK` (`connected_account_id`),
  KEY `product_inventories_products_warehouses_product_inventory` (`inventory_id`),
  CONSTRAINT `product_inventories_products_warehouses_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_inventories_products_warehouses_product_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory_overview` (`inventory_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves all the data and metadata for the products that been recorded into the product inventories. Saves the warehouses that the product belongs';