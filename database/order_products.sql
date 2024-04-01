-- u598963739_control_panel.order_products definition

CREATE TABLE `order_products` (
  `rec_id` varchar(48) NOT NULL,
  `product_id` varchar(48) NOT NULL,
  `order_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `supplied_customer_price` float NOT NULL DEFAULT 0,
  `discount` float NOT NULL DEFAULT 0,
  `discount_percent` float NOT NULL DEFAULT 0,
  `fees` float NOT NULL DEFAULT 0,
  `fee_percent` float NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `order_products_FK` (`order_id`),
  KEY `order_products_FK_1` (`product_id`),
  KEY `order_products_FK_2` (`connected_account_id`),
  CONSTRAINT `order_products_FK` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_products_FK_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_products_FK_2` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table contains the products for each order';