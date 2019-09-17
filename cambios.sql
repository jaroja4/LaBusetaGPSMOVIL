CREATE TABLE `gpsmovilpro`.`tc_passenger` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NULL,
  `document` VARCHAR(20) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gpsmovilpro`.`tc_user_passenger` (
  `userid` INT NOT NULL,
  `passengerid` INT NOT NULL);

ALTER TABLE `gpsmovilpro`.`tc_passenger` 
ADD COLUMN `transportCode` INT(5) NULL AFTER `document`,
ADD COLUMN `status` INT(2) NULL AFTER `transportCode`;

