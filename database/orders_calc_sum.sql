-- u598963739_control_panel.orders_calc_sum definition

CREATE TABLE `orders_calc_sum` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: ordcalc_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `sum` int(11) DEFAULT 0,
  `status` varchar(32) DEFAULT NULL COMMENT 'field is in (''all'', ''confirmed'', ''sent'', ''completed'', ''archived'', ''returned'')',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(25) NOT NULL DEFAULT 'general' COMMENT 'in (''general'', ''yearly'', ''monthly'', ''weekly'')',
  PRIMARY KEY (`rec_id`),
  KEY `orders_calc_sum_FK` (`connected_account_id`),
  CONSTRAINT `orders_calc_sum_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_calc_sum_CHECK` CHECK (`type` in ('general','yearly','monthly','weekly'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the sum of the orders that calculated by automatically process. Saves all the orders for each format and for all orders';