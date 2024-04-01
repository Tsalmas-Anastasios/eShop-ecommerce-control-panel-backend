-- u598963739_control_panel.contacts_email_data definition

CREATE TABLE `contacts_email_data` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: ced_chars(36)',
  `label` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `contact_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `contacts_email_data_FK` (`connected_account_id`),
  KEY `contacts_email_data_FK_1` (`contact_id`),
  CONSTRAINT `contacts_email_data_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contacts_email_data_FK_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the email addresses for the contacts. This table is in relation with table ''contacts''';