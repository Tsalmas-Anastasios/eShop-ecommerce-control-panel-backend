-- u598963739_control_panel.company_warehouses__columns definition

CREATE TABLE `company_warehouses__columns` (
  `column_id` varchar(48) NOT NULL COMMENT 'format: colcwh_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `warehouse_id` varchar(48) NOT NULL,
  `runway_id` varchar(48) NOT NULL,
  `column_name` varchar(100) NOT NULL,
  `column_code` varchar(50) NOT NULL,
  PRIMARY KEY (`column_id`),
  KEY `company_warehouses__columns_accounts_FK` (`connected_account_id`),
  KEY `company_warehouses__columns_company_warehouses_FK` (`warehouse_id`),
  KEY `company_warehouses__columns_company_warehouses__runways_FK` (`runway_id`),
  CONSTRAINT `company_warehouses__columns_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__columns_company_warehouses_FK` FOREIGN KEY (`warehouse_id`) REFERENCES `company_warehouses` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__columns_company_warehouses__runways_FK` FOREIGN KEY (`runway_id`) REFERENCES `company_warehouses__runways` (`runway_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the columns for each runway on the company''s warehouse';