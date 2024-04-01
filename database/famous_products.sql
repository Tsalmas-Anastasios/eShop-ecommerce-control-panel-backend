-- u598963739_control_panel.famous_products definition

CREATE TABLE `famous_products` (
  `rec_id` varchar(48) NOT NULL COMMENT 'fpc_chars(36)',
  `product_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_number` int(11) NOT NULL,
  `type` varchar(25) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `famous_products_FK` (`connected_account_id`),
  KEY `famous_products_FK_1` (`product_id`),
  CONSTRAINT `famous_products_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `famous_products_FK_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the famous products that been calculated every hour.';