-- u598963739_control_panel.accounts definition

CREATE TABLE `accounts` (
  `id` varchar(48) NOT NULL,
  `first_name` varchar(128) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `profile_picture_url` longtext DEFAULT NULL,
  `company_id` varchar(48) NOT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT 0,
  `request_password_change` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(48) NOT NULL,
  `using_bizyhive_cloud` tinyint(1) NOT NULL DEFAULT 1,
  `authentication_2fa__app` tinyint(1) NOT NULL DEFAULT 0,
  `authentication_2fa__email` tinyint(1) NOT NULL DEFAULT 0,
  `authentication_2fa__app_secret` varchar(700) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accounts_FK` (`role`),
  CONSTRAINT `accounts_FK` FOREIGN KEY (`role`) REFERENCES `user_roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table for accounts that corresponds to the main account of the companies';