-- u598963739_control_panel.contact_labels definition

CREATE TABLE `contact_labels` (
  `rec_id` varchar(48) NOT NULL,
  `label_id` varchar(48) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  `contact_id` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `contact_labels_FK` (`connected_account_id`),
  KEY `contact_labels_FK_1` (`contact_id`),
  KEY `contact_labels_FK_2` (`label_id`),
  CONSTRAINT `contact_labels_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contact_labels_FK_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contact_labels_FK_2` FOREIGN KEY (`label_id`) REFERENCES `contact_labels_names` (`label_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the labels for the contacts. This table is in relation with table ''contacts''';