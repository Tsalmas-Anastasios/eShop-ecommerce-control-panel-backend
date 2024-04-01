-- u598963739_control_panel.product_categories definition

CREATE TABLE `product_categories` (
  `pcategory_id` varchar(48) NOT NULL COMMENT 'format: pcg_chars(36)',
  `label` varchar(100) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  PRIMARY KEY (`pcategory_id`),
  KEY `product_categories_FK` (`connected_account_id`),
  CONSTRAINT `product_categories_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table is the storage to save the product categories';