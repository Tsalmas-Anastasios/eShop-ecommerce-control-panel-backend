-- u598963739_control_panel.employee_worked_hours definition

CREATE TABLE `employee_worked_hours` (
  `rec_id` varchar(48) NOT NULL COMMENT 'format: ewh_chars(36)',
  `employee_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `date_day` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'confirmed' COMMENT 'in (''confirmed'', ''done'', ''declined'', ''deleted'')',
  PRIMARY KEY (`rec_id`),
  KEY `employee_worked_hours_FK` (`connected_account_id`),
  KEY `employee_worked_hours_FK_1` (`employee_id`),
  CONSTRAINT `employee_worked_hours_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_worked_hours_FK_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_info` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_worked_hours_CHECK` CHECK (`status` in ('confirmed','done','declined','deleted'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the work hours from emplyees';