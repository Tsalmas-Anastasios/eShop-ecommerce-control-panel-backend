-- u598963739_control_panel.company_warehouses definition

CREATE TABLE `company_warehouses` (
  `warehouse_id` varchar(48) NOT NULL COMMENT 'format: cwrh_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `distinctive_title` varchar(254) NOT NULL,
  `code_name` varchar(100) NOT NULL,
  `ownership_type` varchar(100) NOT NULL COMMENT 'in (''privately_owned'', ''rental'', ''granting'', ''other'')',
  `square_meters` float NOT NULL,
  `power_type` varchar(100) NOT NULL COMMENT 'in (''three_phase'', ''single_phase'')',
  `warehouse_license_number` varchar(45) NOT NULL,
  `building_permit_number` varchar(45) NOT NULL,
  `building_year` varchar(4) NOT NULL,
  `reception_exist` tinyint(1) NOT NULL DEFAULT 0,
  `parking_spaces` int(11) NOT NULL DEFAULT 0,
  `unloading_vehicles_places_number` int(11) NOT NULL DEFAULT 0,
  `energy_class` varchar(8) NOT NULL,
  `bathrooms_number` int(11) NOT NULL DEFAULT 0,
  `offices_number` int(11) NOT NULL DEFAULT 0,
  `plot__street` varchar(254) NOT NULL,
  `plot__postal_code` varchar(10) NOT NULL,
  `plot__country` varchar(254) NOT NULL,
  `plot__city` varchar(254) NOT NULL,
  `plot__state` varchar(254) NOT NULL,
  `plot__latitude` float NOT NULL,
  `plot__longitude` float NOT NULL,
  `contact__street` varchar(254) NOT NULL,
  `contact__postal_code` varchar(10) NOT NULL,
  `contact__country` varchar(254) NOT NULL,
  `contact__city` varchar(254) NOT NULL,
  `contact__state` varchar(254) NOT NULL,
  `contact__latitude` float NOT NULL,
  `contact__longitude` float NOT NULL,
  `contact__phone` varchar(20) NOT NULL,
  `warehouse_manager__fullname` varchar(254) NOT NULL,
  `warehouse_manager__company_position` varchar(254) NOT NULL,
  `warehouse_manager__date_of_birth` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `warehouse_manager__social_security_number` varchar(200) NOT NULL,
  `warehouse_manager__personal_tax_id` varchar(100) NOT NULL,
  `warehouse_manager__phone` varchar(20) NOT NULL,
  `warehouse_manager__phone2` varchar(20) DEFAULT NULL,
  `warehouse_manager__company_email` varchar(254) NOT NULL,
  `warehouse_manager__personal_email` varchar(254) NOT NULL,
  PRIMARY KEY (`warehouse_id`),
  KEY `company_warehouses_accounts_FK` (`connected_account_id`),
  CONSTRAINT `company_warehouses_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_warehouses_check` CHECK (`ownership_type` in ('privately_owned','rental','granting','other')),
  CONSTRAINT `company_warehouses_check_1` CHECK (`power_type` in ('three_phase','single_phase'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the warehouses that a company has.';