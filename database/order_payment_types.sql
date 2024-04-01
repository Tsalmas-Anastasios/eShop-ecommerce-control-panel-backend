-- u598963739_control_panel.order_payment_types definition

CREATE TABLE `order_payment_types` (
  `rec_id` varchar(48) NOT NULL,
  `label` varchar(128) NOT NULL,
  `description` mediumtext NOT NULL,
  `service` varchar(128) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the payment types that we support on the system';