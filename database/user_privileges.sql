-- u598963739_control_panel.user_privileges definition

CREATE TABLE `user_privileges` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `privilege_type` varchar(100) NOT NULL,
  `value` tinyint(1) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `user_privilleges_FK` (`connected_account_id`),
  KEY `user_privilleges_FK_1` (`user_id`),
  CONSTRAINT `user_privilleges_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_privilleges_FK_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the user''s privilleges';