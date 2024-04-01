-- u598963739_control_panel.companies definition

CREATE TABLE `companies` (
  `rec_id` varchar(48) NOT NULL,
  `business_name` varchar(100) NOT NULL,
  `shop_name` varchar(100) NOT NULL,
  `tax_id` varchar(54) NOT NULL,
  `tax_authority` varchar(128) NOT NULL,
  `contact_person__first_name` varchar(100) NOT NULL,
  `contact_person__last_name` varchar(100) NOT NULL,
  `contact_person__middle` varchar(100) NOT NULL,
  `contact_email` varchar(128) NOT NULL,
  `contact_phone` varchar(20) NOT NULL,
  `company_email` varchar(128) NOT NULL,
  `company_phone` varchar(20) NOT NULL,
  `shop_url` varchar(128) NOT NULL,
  `shop_type` varchar(128) NOT NULL,
  `products_categories` mediumtext DEFAULT NULL COMMENT 'Field format: [ category0, category1, ... , categoryN ]',
  `headquarters_address__street` varchar(100) NOT NULL,
  `headquarters_address__city` varchar(100) NOT NULL,
  `headquarters_address__postal_code` varchar(100) NOT NULL,
  `headquarters_address__state` varchar(100) NOT NULL,
  `headquarters_address__country` varchar(100) NOT NULL,
  `headquarters_longitude` float DEFAULT NULL,
  `headquarters_latitude` float DEFAULT NULL,
  `operating_hours__monday_start` varchar(10) NOT NULL,
  `operating_hours__monday_end` varchar(10) NOT NULL,
  `operating_hours__monday_close` tinyint(1) NOT NULL DEFAULT 0,
  `operating_hours__tuesday_start` varchar(10) NOT NULL,
  `operating_hours__tuesday_end` varchar(10) NOT NULL,
  `operating_hours__tuesday_close` tinyint(1) NOT NULL DEFAULT 0,
  `operating_hours__wednesday_start` varchar(10) NOT NULL,
  `operating_hours__wednesday_end` varchar(10) NOT NULL,
  `operating_hours__wednesday_close` tinyint(1) NOT NULL DEFAULT 0,
  `operating_hours__thursday_start` varchar(10) NOT NULL,
  `operating_hours__thursday_end` varchar(10) NOT NULL,
  `operating_hours__thursday_close` tinyint(1) NOT NULL DEFAULT 0,
  `operating_hours__friday_start` varchar(10) NOT NULL,
  `operating_hours__friday_end` varchar(10) NOT NULL,
  `operating_hours__friday_close` tinyint(1) NOT NULL DEFAULT 0,
  `operating_hours__saturday_start` varchar(10) NOT NULL,
  `operating_hours__saturday_end` varchar(10) NOT NULL,
  `operating_hours__saturday_close` tinyint(1) NOT NULL DEFAULT 1,
  `operating_hours__sunday_start` varchar(10) NOT NULL,
  `operating_hours__sunday_end` varchar(10) NOT NULL,
  `operating_hours__sunday_close` tinyint(1) NOT NULL DEFAULT 1,
  `facebook_url` varchar(256) DEFAULT NULL,
  `instagram_url` varchar(256) DEFAULT NULL,
  `twitter_url` varchar(256) DEFAULT NULL,
  `linkedIn_url` varchar(256) DEFAULT NULL,
  `youtube_url` varchar(256) DEFAULT NULL,
  `whatsapp_url` varchar(256) DEFAULT NULL,
  `tiktok_url` varchar(256) DEFAULT NULL,
  `google_business_url` varchar(256) DEFAULT NULL,
  `shop_google_rate_url` varchar(256) DEFAULT 'https://adorithm.com',
  `company_description` longtext DEFAULT NULL,
  `shop_logo` varchar(500) NOT NULL DEFAULT 'https://adorithm.com/assets/logo/logo.png',
  `connected_account_id` varchar(48) NOT NULL,
  `coin_symbol` varchar(1) NOT NULL,
  `coin_label` varchar(256) NOT NULL,
  `coin_description` varchar(256) DEFAULT NULL,
  `coin_correspondence_in_eur` float NOT NULL,
  `coin_value` varchar(100) NOT NULL,
  `fee_percent` float NOT NULL COMMENT 'Percentage of VAT added to the final value of the shop''s products',
  `slug` varchar(254) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `companies_FK` (`connected_account_id`),
  CONSTRAINT `companies_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table includes the data of the signed up companies (corresponds to ONLY ONE account)';