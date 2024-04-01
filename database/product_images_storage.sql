-- u598963739_control_panel.product_images_storage definition

CREATE TABLE `product_images_storage` (
  `id` varchar(48) NOT NULL COMMENT 'format: pim_chars(36)',
  `url` mediumtext NOT NULL,
  `main_image` tinyint(1) NOT NULL DEFAULT 0,
  `product_id` varchar(48) NOT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `connected_account_id` varchar(48) NOT NULL,
  `product_version` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_storage_FK` (`product_id`),
  CONSTRAINT `product_images_storage_FK` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Saved the links for the images of the products';