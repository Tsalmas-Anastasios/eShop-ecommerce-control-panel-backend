-- u598963739_control_panel.product_inventory_overview definition

CREATE TABLE `product_inventory_overview` (
  `inventory_id` varchar(48) NOT NULL COMMENT 'format: pinv_chars(36)',
  `connected_account_id` varchar(100) NOT NULL,
  `descriptive_title` varchar(254) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by__user_id` varchar(48) NOT NULL,
  `created_by__first_name` varchar(128) NOT NULL,
  `created_by__last_name` varchar(100) NOT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `product_inventory_overview_accounts_FK` (`connected_account_id`),
  CONSTRAINT `product_inventory_overview_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the overview data for product inventories';