-- u598963739_control_panel.contact_labels_names definition

CREATE TABLE `contact_labels_names` (
  `label_id` varchar(48) NOT NULL,
  `label` varchar(100) NOT NULL,
  `connected_account_id` varchar(48) NOT NULL,
  PRIMARY KEY (`label_id`),
  KEY `contact_labels_names_FK` (`connected_account_id`),
  CONSTRAINT `contact_labels_names_FK` FOREIGN KEY (`connected_account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the contact labels for the contacts.';