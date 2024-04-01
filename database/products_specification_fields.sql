-- u598963739_control_panel.products_specification_fields definition

CREATE TABLE `products_specification_fields` (
  `id` varchar(48) NOT NULL COMMENT 'format: chars(36)',
  `specification_field_name` varchar(255) NOT NULL,
  `specification_field_value` mediumtext NOT NULL,
  `specification_category_id` varchar(48) NOT NULL,
  `product_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `product_version` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_specification_fields_FK` (`connected_account_id`),
  KEY `products_specification_fields_FK_1` (`specification_category_id`),
  KEY `products_specification_fields_FK_2` (`product_id`),
  CONSTRAINT `products_specification_fields_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_specification_fields_FK_1` FOREIGN KEY (`specification_category_id`) REFERENCES `products_specification_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_specification_fields_FK_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the fields of the specification of shop''s product';