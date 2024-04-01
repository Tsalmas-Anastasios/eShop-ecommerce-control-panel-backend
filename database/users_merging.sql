-- u598963739_control_panel.users_merging definition

CREATE TABLE `users_merging` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(48) NOT NULL,
  `username` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `connected_table` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_merging_relation_1` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table includes, merge and seperates all the users and a';