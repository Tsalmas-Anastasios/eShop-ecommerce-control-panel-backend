-- u598963739_control_panel.authentication_2fa__email_codes definition

CREATE TABLE `authentication_2fa__email_codes` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_account_id` varchar(48) NOT NULL,
  `acc_table` varchar(20) DEFAULT NULL COMMENT '''users'' or ''accounts''',
  `code` varchar(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves temporary the codes for email authentication to access the account';