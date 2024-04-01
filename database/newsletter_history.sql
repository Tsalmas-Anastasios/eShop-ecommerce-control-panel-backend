-- u598963739_control_panel.newsletter_history definition

CREATE TABLE `newsletter_history` (
  `message_id` varchar(48) NOT NULL COMMENT 'format: nlm_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `subject` varchar(128) NOT NULL,
  `message` longtext NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sent_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `newsletter_history_FK` (`connected_account_id`),
  CONSTRAINT `newsletter_history_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newsletter_history_CHECK` CHECK (`status` in ('draft','sent','archived'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the history of the emails sending for newsletter from the shops';