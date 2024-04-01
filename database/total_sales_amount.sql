-- u598963739_control_panel.total_sales_amount definition

CREATE TABLE `total_sales_amount` (
  `rec_id` varchar(48) NOT NULL COMMENT 'tsm_chars(36)',
  `amount` float DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `connected_account_id` varchar(48) NOT NULL,
  `type` varchar(25) NOT NULL DEFAULT 'general' COMMENT 'in (''general'', ''yearly'', ''monthly'', ''weekly'')',
  PRIMARY KEY (`rec_id`),
  KEY `total_sales_monthly_FK` (`connected_account_id`),
  CONSTRAINT `total_sales_monthly_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the new total sales calculation that been calculated each minute when the app is running';