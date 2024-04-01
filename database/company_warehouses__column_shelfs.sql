-- u598963739_control_panel.company_warehouses__column_shelfs definition

CREATE TABLE `company_warehouses__column_shelfs` (
  `shelf_id` varchar(48) NOT NULL COMMENT 'shcolcwh_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `warehouse_id` varchar(48) NOT NULL,
  `runway_id` varchar(48) NOT NULL,
  `column_id` varchar(48) NOT NULL,
  `shelf_code` varchar(50) NOT NULL,
  PRIMARY KEY (`shelf_id`),
  KEY `company_warehouses__column_shelfs_accounts_FK` (`connected_account_id`),
  KEY `company_warehouses__column_shelfs_company_warehouses_FK` (`warehouse_id`),
  KEY `company_warehouses__column_shelfs_company_warehouses__runways_FK` (`runway_id`),
  KEY `company_warehouses__column_shelfs_company_warehouses__columns_FK` (`column_id`),
  CONSTRAINT `company_warehouses__column_shelfs_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__column_shelfs_company_warehouses_FK` FOREIGN KEY (`warehouse_id`) REFERENCES `company_warehouses` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__column_shelfs_company_warehouses__columns_FK` FOREIGN KEY (`column_id`) REFERENCES `company_warehouses__columns` (`column_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__column_shelfs_company_warehouses__runways_FK` FOREIGN KEY (`runway_id`) REFERENCES `company_warehouses__runways` (`runway_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the shelfs that belongs to the columns of the company''s warehouses';