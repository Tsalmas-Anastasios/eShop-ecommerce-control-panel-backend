-- u598963739_control_panel.user_roles definition

CREATE TABLE `user_roles` (
  `role_id` varchar(48) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table describes the roles that a user can have. The data here changed only manually by the DataBase.';