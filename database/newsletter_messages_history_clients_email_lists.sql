-- u598963739_control_panel.newsletter_messages_history_clients_email_lists definition

CREATE TABLE `newsletter_messages_history_clients_email_lists` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: nme_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `message_id` varchar(48) NOT NULL,
  `email_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `newsletter_clients_email_lists_FK` (`connected_account_id`),
  KEY `newsletter_clients_email_lists_FK_1` (`email_id`),
  KEY `newsletter_clients_email_lists_FK_2` (`message_id`),
  CONSTRAINT `newsletter_clients_email_lists_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newsletter_clients_email_lists_FK_1` FOREIGN KEY (`email_id`) REFERENCES `newsletter_clients_email` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newsletter_clients_email_lists_FK_2` FOREIGN KEY (`message_id`) REFERENCES `newsletter_history` (`message_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the lists of the emails (the id of them) from newsletter messages from the shops';