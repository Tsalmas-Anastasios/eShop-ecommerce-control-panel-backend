-- u598963739_control_panel.orders_transactions definition

CREATE TABLE `orders_transactions` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `updated_by` varchar(48) NOT NULL,
  `order_created_at` timestamp NULL DEFAULT NULL,
  `whole_order_updated` tinyint(1) NOT NULL DEFAULT 0,
  `status_updated` tinyint(1) NOT NULL DEFAULT 0,
  `status_before` varchar(100) DEFAULT NULL,
  `status_after` varchar(100) DEFAULT NULL,
  `field_changed` varchar(254) DEFAULT NULL,
  `value_before` mediumtext DEFAULT NULL,
  `value_after` mediumtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `orders_transactions_orders_FK` (`order_id`),
  KEY `orders_transactions_accounts_FK` (`connected_account_id`),
  CONSTRAINT `orders_transactions_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_transactions_orders_FK` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves all order transactions.';