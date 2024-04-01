-- u598963739_control_panel.login_sessions definition

CREATE TABLE `login_sessions` (
  `login_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `user_account_id` varchar(48) NOT NULL,
  `session_id` varchar(48) DEFAULT NULL,
  `expires` bigint(20) DEFAULT NULL,
  `session_data` longtext DEFAULT NULL,
  `country_code` varchar(5) DEFAULT NULL,
  `country_name` varchar(70) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal` varchar(20) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `ipv4` varchar(100) DEFAULT NULL,
  `ipv6` varchar(256) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `using_bizyhive_cloud` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  KEY `login_sessions_FK` (`connected_account_id`),
  CONSTRAINT `login_sessions_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves data from logins and additional meta-data';