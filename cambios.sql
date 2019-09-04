CREATE TABLE `gpsmovilpro`.`tc_passenger` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NULL,
  `document` VARCHAR(20) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gpsmovilpro`.`tc_user_passenger` (
  `userid` INT NOT NULL,
  `passengerid` INT NOT NULL);
