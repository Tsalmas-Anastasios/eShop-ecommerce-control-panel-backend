-- u598963739_control_panel.products_stock_warehouses definition

CREATE TABLE `products_stock_warehouses` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: chars(36)',
  `product_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `warehouse_id` varchar(48) DEFAULT NULL,
  `runway_id` varchar(48) NOT NULL,
  `column_id` varchar(48) NOT NULL,
  `column_shelf_id` varchar(48) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `products_stock_warehouses_accounts_FK` (`connected_account_id`),
  KEY `products_stock_warehouses_products_FK` (`product_id`),
  KEY `products_stock_warehouses_company_warehouses_FK` (`warehouse_id`),
  KEY `products_stock_warehouses_company_warehouses__runways_FK` (`runway_id`),
  KEY `products_stock_warehouses_company_warehouses__columns_FK` (`column_id`),
  KEY `products_stock_warehouses_company_warehouses__column_shelfs_FK` (`column_shelf_id`),
  CONSTRAINT `products_stock_warehouses_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_stock_warehouses_company_warehouses_FK` FOREIGN KEY (`warehouse_id`) REFERENCES `company_warehouses` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_stock_warehouses_company_warehouses__column_shelfs_FK` FOREIGN KEY (`column_shelf_id`) REFERENCES `company_warehouses__column_shelfs` (`shelf_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_stock_warehouses_company_warehouses__columns_FK` FOREIGN KEY (`column_id`) REFERENCES `company_warehouses__columns` (`column_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_stock_warehouses_company_warehouses__runways_FK` FOREIGN KEY (`runway_id`) REFERENCES `company_warehouses__runways` (`runway_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_stock_warehouses_products_FK` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the stocks that belongs to the products';