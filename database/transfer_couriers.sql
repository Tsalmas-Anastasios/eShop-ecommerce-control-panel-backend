-- u598963739_control_panel.transfer_couriers definition

CREATE TABLE `transfer_couriers` (
  `rec_id` varchar(128) NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` varchar(48) NOT NULL COMMENT 'Here we save the id of the transfer company type (e.g. courier, etc)',
  `description` mediumtext NOT NULL,
  `banner_url` mediumtext NOT NULL,
  `main_url` varchar(256) NOT NULL,
  `tracking_basic_url` text NOT NULL,
  `integrated` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_id`),
  KEY `transfer_couriers_FK` (`type`),
  CONSTRAINT `transfer_couriers_FK` FOREIGN KEY (`type`) REFERENCES `transfer_couriers_types` (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This is a table where the integrated couriers are saved to organize them';