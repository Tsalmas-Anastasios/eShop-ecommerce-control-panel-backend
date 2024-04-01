-- u598963739_control_panel.famous_products_per_category definition

CREATE TABLE `famous_products_per_category` (
  `rec_id` varchar(48) NOT NULL COMMENT 'fpc_chars(36)',
  `product_id` varchar(48) NOT NULL,
  `products_category_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `row_number` int(11) NOT NULL,
  `type` varchar(24) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `famous_products_per_category_FK` (`product_id`),
  KEY `famous_products_per_category_FK_1` (`products_category_id`),
  KEY `famous_products_per_category_FK_2` (`connected_account_id`),
  CONSTRAINT `famous_products_per_category_FK` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `famous_products_per_category_FK_1` FOREIGN KEY (`products_category_id`) REFERENCES `product_categories` (`pcategory_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `famous_products_per_category_FK_2` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `famous_products_per_category_CHECK` CHECK (`type` in ('general','yearly','monthly','weekly'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves famous products per shop per category';