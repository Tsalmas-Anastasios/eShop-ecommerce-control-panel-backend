-- u598963739_control_panel.product_inventories_products definition

CREATE TABLE `product_inventories_products` (
  `rec_product_id` varchar(64) NOT NULL COMMENT 'format: chars(64)',
  `inventory_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `product_id` varchar(48) NOT NULL,
  `product_headline` varchar(256) NOT NULL,
  `product_brand` varchar(48) NOT NULL,
  `product_model` varchar(256) NOT NULL,
  `product_code` varchar(48) NOT NULL,
  `inventory_product_stock` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_product_id`),
  KEY `product_inventories_products_accounts_FK` (`connected_account_id`),
  KEY `product_inventories_products_product_inventory_overview_FK` (`inventory_id`),
  CONSTRAINT `product_inventories_products_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_inventories_products_product_inventory_overview_FK` FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory_overview` (`inventory_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves all the data and metadata for the products that been recorded into the product inventories';