-- u598963739_control_panel.order_papers definition

CREATE TABLE `order_papers` (
  `id` varchar(48) NOT NULL COMMENT 'format: ordpaper_chars(36)',
  `url` mediumtext NOT NULL,
  `order_id` varchar(48) NOT NULL,
  `type` varchar(100) NOT NULL COMMENT 'in ''invoice'' | ''receipt'' | ''proof_of_order'' | ''dispatch_form'' | ''tracking_number''',
  `archived` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `connected_account_id` varchar(48) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_papers_FK` (`connected_account_id`),
  KEY `order_papers_FK_1` (`order_id`),
  CONSTRAINT `order_papers_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_papers_FK_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_papers_CHECK` CHECK (`type` = 'invoice' | 'receipt' | 'proof_of_order' | 'dispatch_form' | 'tracking_number')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the links / urls which be used to recognize the order''s papers.';