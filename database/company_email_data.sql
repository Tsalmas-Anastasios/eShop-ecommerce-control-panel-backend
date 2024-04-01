-- u598963739_control_panel.company_email_data definition

CREATE TABLE `company_email_data` (
  `email_id` varchar(48) NOT NULL COMMENT 'format: ned_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `email_label` varchar(100) NOT NULL,
  `host` varchar(100) NOT NULL,
  `port` int(11) NOT NULL,
  `secure` tinyint(1) NOT NULL COMMENT 'if encryption === ''SSL/TLS'' --> true, else --> false',
  `user` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `default_name` varchar(128) NOT NULL,
  `default_email` varchar(128) NOT NULL,
  PRIMARY KEY (`email_id`),
  KEY `company_email_data_FK` (`connected_account_id`),
  CONSTRAINT `company_email_data_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the company''s emails to use them in the newsletter & more';