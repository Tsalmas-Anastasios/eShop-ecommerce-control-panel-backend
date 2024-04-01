-- u598963739_control_panel.contacts definition

CREATE TABLE `contacts` (
  `contact_id` varchar(48) NOT NULL COMMENT 'format: cnt_chars(36)',
  `connected_account_id` varchar(48) NOT NULL,
  `image_url` mediumtext DEFAULT NULL,
  `prefix` varchar(15) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `suffix` varchar(15) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `name_in_speaking_format` varchar(100) DEFAULT NULL,
  `father_name_in_speaking_format` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `archive_as` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `work_position_title` varchar(100) DEFAULT NULL,
  `work_department` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `website` varchar(256) DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `private` tinyint(1) NOT NULL DEFAULT 0,
  `private_user_id` varchar(48) DEFAULT NULL,
  `favorite` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`contact_id`),
  KEY `contacts_FK` (`connected_account_id`),
  CONSTRAINT `contacts_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table used to save the contacts for the shops (embeded app --> contacts)';