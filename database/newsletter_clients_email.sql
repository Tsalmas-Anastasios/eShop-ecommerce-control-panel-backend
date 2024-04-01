-- u598963739_control_panel.newsletter_clients_email definition

CREATE TABLE `newsletter_clients_email` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: nec_chars(36)',
  `client_email` varchar(128) NOT NULL,
  `client_name` varchar(128) DEFAULT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `newsletter_clients_email_FK` (`connected_account_id`),
  CONSTRAINT `newsletter_clients_email_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the emails from the shops clients to use them in the newsletter';