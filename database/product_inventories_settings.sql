-- u598963739_control_panel.product_inventories_settings definition

CREATE TABLE `product_inventories_settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `connected_account_id` varchar(48) NOT NULL,
  `type` varchar(128) NOT NULL,
  `value` varchar(256) NOT NULL,
  `setting_auto_generate_date__day` varchar(2) DEFAULT NULL,
  `setting_auto_generate_date__month` varchar(2) DEFAULT NULL,
  `setting_auto_generate_date_frequency` varchar(32) DEFAULT NULL COMMENT 'in (''yearly'', ''monthly'', ''weekly'', ''daily'')',
  `setting_auto_generate_date_frequency__day` varchar(32) DEFAULT NULL,
  `setting_auto_generate_date_frequency__month` varchar(32) DEFAULT NULL,
  `meta` mediumtext NOT NULL COMMENT 'metadata',
  PRIMARY KEY (`setting_id`),
  KEY `product_inventories_settings_accounts_FK` (`connected_account_id`),
  CONSTRAINT `product_inventories_settings_accounts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_inventories_settings_check` CHECK (`setting_auto_generate_date_frequency` in ('yearly','monthly','weekly','daily'))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the settings for each account for the product inventories.';