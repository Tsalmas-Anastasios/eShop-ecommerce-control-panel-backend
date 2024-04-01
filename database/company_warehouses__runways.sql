-- u598963739_control_panel.company_warehouses__runways definition

CREATE TABLE `company_warehouses__runways` (
  `runway_id` varchar(48) NOT NULL COMMENT 'cwhrw_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `warehouse_id` varchar(48) NOT NULL,
  `runway_name` varchar(100) NOT NULL,
  `runway_code` varchar(50) NOT NULL,
  PRIMARY KEY (`runway_id`),
  KEY `company_warehouses__runways_accounts_FK` (`connected_account_id`),
  KEY `company_warehouses__runways_company_warehouses_FK` (`warehouse_id`),
  CONSTRAINT `company_warehouses__runways_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses__runways_company_warehouses_FK` FOREIGN KEY (`warehouse_id`) REFERENCES `company_warehouses` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the warehouse''s runways for saving products';