-- u598963739_control_panel.contacts_address_data definition

CREATE TABLE `contacts_address_data` (
  `rec_id` varchar(48) NOT NULL,
  `country` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `address_line_2` varchar(100) DEFAULT NULL,
  `postal_code` varchar(15) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_vault` varchar(100) DEFAULT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `contact_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `contacts_address_data_FK` (`connected_account_id`),
  KEY `contacts_address_data_FK_1` (`contact_id`),
  CONSTRAINT `contacts_address_data_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contacts_address_data_FK_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the addresses for the contacts. This table is in relation with table ''contacts''';