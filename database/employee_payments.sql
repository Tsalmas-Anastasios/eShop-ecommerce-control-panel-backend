-- u598963739_control_panel.employee_payments definition

CREATE TABLE `employee_payments` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: epa_chars(36)',
  `employee_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `version_label` varchar(100) NOT NULL,
  `hourly_payment` float NOT NULL,
  `payment_frequency` varchar(30) NOT NULL COMMENT 'in (''per_day'', ''per_3_days'', ''per_5_days'', ''per_10_days'', ''per_15_days'', ''per_month'')',
  `hours_per_day` int(11) NOT NULL,
  `initial_payment_date` date NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_id`),
  KEY `employee_payments_FK` (`connected_account_id`),
  KEY `employee_payments_FK_1` (`employee_id`),
  CONSTRAINT `employee_payments_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_payments_FK_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_payments` (`rec_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_payments_CHECK` CHECK (`payment_frequency` in ('per_day','per_3_days','per_5_days','per_10_days','per_15_days','per_month'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the emplyee payments information';