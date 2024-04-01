-- u598963739_control_panel.employee_done_payments definition

CREATE TABLE `employee_done_payments` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: edp_chars(36)',
  `employee_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `payment_version_id` varchar(48) NOT NULL,
  `payment_date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) DEFAULT 'done',
  PRIMARY KEY (`rec_id`),
  KEY `employee_done_payments_FK` (`connected_account_id`),
  KEY `employee_done_payments_FK_1` (`employee_id`),
  KEY `employee_done_payments_FK_2` (`payment_version_id`),
  CONSTRAINT `employee_done_payments_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_done_payments_FK_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_info` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_done_payments_FK_2` FOREIGN KEY (`payment_version_id`) REFERENCES `employee_payments` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the payments that done by the shop to the employee';