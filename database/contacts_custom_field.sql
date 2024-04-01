-- u598963739_control_panel.contacts_custom_field definition

CREATE TABLE `contacts_custom_field` (
  `rec_id` varchar(48) NOT NULL,
  `label` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `contact_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `contacts_custom_field_FK` (`connected_account_id`),
  KEY `contacts_custom_field_FK_1` (`contact_id`),
  CONSTRAINT `contacts_custom_field_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contacts_custom_field_FK_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the custom fields for the contacts. This table is in relation with table ''contacts''';