-- u598963739_control_panel.users definition

CREATE TABLE `users` (
  `id` varchar(48) NOT NULL,
  `first_name` varchar(128) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `email` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `profile_picture_url` longtext DEFAULT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT 0,
  `request_password_change` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `connected_account` varchar(48) NOT NULL,
  `is_account` tinyint(1) NOT NULL DEFAULT 0,
  `role` varchar(48) NOT NULL,
  `authentication_2fa__app` tinyint(1) NOT NULL DEFAULT 0,
  `authentication_2fa__email` tinyint(1) NOT NULL DEFAULT 0,
  `authentication_2fa__app_secret` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`id`),
  KEY `users_FK` (`connected_account`),
  KEY `users_FK_1` (`role`),
  CONSTRAINT `users_FK` FOREIGN KEY (`connected_account`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_FK_1` FOREIGN KEY (`role`) REFERENCES `user_roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table that represents the users of the app (includes the accounts)';