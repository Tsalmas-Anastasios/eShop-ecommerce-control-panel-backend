-- u598963739_control_panel.products_specification_categories definition

CREATE TABLE `products_specification_categories` (
  `id` varchar(48) NOT NULL COMMENT 'format: char(36)',
  `category_name` varchar(256) NOT NULL,
  `product_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `product_version` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_specification_cateogories_FK` (`connected_account_id`),
  KEY `products_specification_cateogories_FK_1` (`product_id`),
  CONSTRAINT `products_specification_cateogories_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_specification_cateogories_FK_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the specification categories for each product';