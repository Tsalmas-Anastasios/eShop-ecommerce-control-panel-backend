-- u598963739_control_panel.system_errors definition

CREATE TABLE `system_errors` (
  `error_id` int(11) NOT NULL AUTO_INCREMENT,
  `system_part` varchar(25) NOT NULL DEFAULT 'backend',
  `error_code` varchar(4) NOT NULL DEFAULT '500',
  `error_metadata` longtext NOT NULL,
  PRIMARY KEY (`error_id`),
  CONSTRAINT `system_part_CHECK` CHECK (`system_part` in ('backend','frontend'))
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the errors that made by system in the backend or frontend';