-- u598963739_control_panel.url_shortener definition

CREATE TABLE `url_shortener` (
  `url_id` varchar(48) NOT NULL,
  `url_address` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table saves the url shortener mechanism''s urls';