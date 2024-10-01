DROP DATABASE IF EXISTS fitness_track_db;
CREATE DATABASE fitness_track_db;
USE fitness_track_db;

CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_salt` varchar(255) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `user`;
INSERT INTO `user` (`usr_id`, `username`, `usr_password`, `usr_salt`) VALUES
	(1, 'student', '83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4', '48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9'),
	(2, 'graduate', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc');

CREATE TABLE IF NOT EXISTS `workouts` (
  `workout_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usr_id` int(10) unsigned NOT NULL,
  `workout_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workout_date` DATETIME NOT NULL,
  PRIMARY KEY (`workout_id`),
  KEY FK_USER_ID (`usr_id`),
  CONSTRAINT FK_USER_ID FOREIGN KEY (`usr_id`) REFERENCES `user` (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `exercise` (
  `exercise_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `exercise_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`exercise_id`),
  UNIQUE KEY (`exercise_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `exercise`;
INSERT INTO `exercise` (`exercise_id`, `exercise_name`) VALUES
	(1, 'Bench Press'),
    (2, 'Incline Bench Press'),
    (3, 'Dumbell Bench Press'),
    (4, 'Incline Dumbell Press'),
    (5, 'Shoulder Press'),
    (6, 'Lateral Raise'),
    (7, 'Lat Pulldown'),
    (8, 'Barbell Row'),
    (9, 'Cable Row'),
    (10, 'Squat'),
    (11, 'Deadlift'),
    (12, 'RDL'),
    (13, 'Leg Press'),
    (14, 'Hack Squat'),
    (15, 'Leg Curl'),
    (16, 'Quad Extention'),
    (17, 'Bicep Curl'),
    (18, 'Hammer Curl'),
    (19, 'Preacher Curl'),
    (20, 'Tricep Pressdown'),
    (21, 'Skullcrusher');
    
CREATE TABLE IF NOT EXISTS `exercise_bests` (
  `usr_id` int(10) unsigned NOT NULL,
  `exercise_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `best` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`usr_id`, `exercise_name`),
  KEY FK_USER_BEST_ID (`usr_id`),
  KEY FK_EXERCISE_BEST (`exercise_name`),
  CONSTRAINT FK_USER_BEST_ID FOREIGN KEY (`usr_id`) REFERENCES `user` (`usr_id`),
  CONSTRAINT FK_EXERCISE_BEST FOREIGN KEY (`exercise_name`) REFERENCES `exercise` (`exercise_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workout_item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workout_id` int(10) unsigned NOT NULL,
  `exercise_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sets` int(11) NOT NULL,
  `reps` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY FK_WORKOUT_ID (`workout_id`),
  KEY FK_EXERCISE_NAME (`exercise_name`),
  CONSTRAINT FK_WORKOUT_ID FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`),
  CONSTRAINT FK_EXERCISE_NAME FOREIGN KEY (`exercise_name`) REFERENCES `exercise` (`exercise_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;