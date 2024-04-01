-- u598963739_control_panel.account_tokens definition

CREATE TABLE `account_tokens` (
  `token_id` varchar(48) NOT NULL COMMENT 'format: tkn_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `token_value` mediumtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `products_open` tinyint(1) NOT NULL DEFAULT 0,
  `product_categories_open` tinyint(4) NOT NULL DEFAULT 0,
  `newsletter_open` tinyint(4) NOT NULL DEFAULT 0,
  `cart_checkout_open` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`token_id`),
  KEY `NewTable_FK` (`connected_account_id`),
  CONSTRAINT `NewTable_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the tokens for the accounts';