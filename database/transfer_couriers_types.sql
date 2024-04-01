-- u598963739_control_panel.transfer_couriers_types definition

CREATE TABLE `transfer_couriers_types` (
  `rec_id` varchar(48) NOT NULL,
  `type_description` varchar(48) NOT NULL,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Here we save the id of the transfer company type (e.g. courier, etc)';