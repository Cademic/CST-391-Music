-- ===============================
-- CREATE DATABASE
-- ===============================
DROP DATABASE IF EXISTS `music`;
CREATE DATABASE `music`;
USE `music`;

-- ===============================
-- CREATE TABLES
-- ===============================

CREATE TABLE `ALBUM` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(255) NOT NULL,
  `ARTIST` varchar(255) NOT NULL,
  `YEAR` int DEFAULT NULL,
  `IMAGE_NAME` varchar(512) DEFAULT NULL,
  `DESCRIPTION` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `TRACK` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ALBUM_ID` int NOT NULL,
  `NUMBER` int DEFAULT NULL,
  `TITLE` varchar(255) DEFAULT NULL,
  `LYRICS` text,
  `VIDEO` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ALBUM_ID` (`ALBUM_ID`),
  CONSTRAINT `TRACK_ALBUM_FK`
    FOREIGN KEY (`ALBUM_ID`)
    REFERENCES `ALBUM` (`ID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- INSERT ALBUMS
-- ===============================

INSERT INTO `ALBUM` (`TITLE`,`ARTIST`,`YEAR`,`IMAGE_NAME`,`DESCRIPTION`) VALUES
('Back in Black','AC/DC',1980,'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/ACDC_Back_in_Black.png/960px-ACDC_Back_in_Black.png','One of the best selling rock albums of all time.'),
('Highway to Hell','AC/DC',1979,'https://upload.wikimedia.org/wikipedia/en/a/ac/Acdc_Highway_to_Hell.JPG','Final AC/DC album featuring Bon Scott.'),
('For Those About to Rock We Salute You','AC/DC',1981,'https://upload.wikimedia.org/wikipedia/en/5/5c/ForThoseAboutToRock_ACDCalbum.jpg','Legendary AC/DC album known for its explosive title track.'),

('Hybrid Theory','Linkin Park',2000,'https://upload.wikimedia.org/wikipedia/en/2/2c/Linkin_Park_Hybrid_Theory_Album_Cover.jpg','Linkin Parks breakthrough debut album.'),
('Meteora','Linkin Park',2003,'https://upload.wikimedia.org/wikipedia/en/b/b1/Linkin_Park_Meteora_Album_Cover.jpg','One of the most popular nu metal albums ever released.'),
('Minutes to Midnight','Linkin Park',2007,'https://upload.wikimedia.org/wikipedia/en/7/7e/Minutes_to_Midnight_cover.jpg','A stylistic shift toward alternative rock.'),

('Nevermind','Nirvana',1991,'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg','The album that brought grunge to the mainstream.'),
('In Utero','Nirvana',1993,'https://upload.wikimedia.org/wikipedia/en/e/e5/In_Utero_%28Nirvana%29_album_cover.jpg','A darker more raw follow up to Nevermind.'),
('Bleach','Nirvana',1989,'https://upload.wikimedia.org/wikipedia/en/a/a1/NirvanaBleachalbumcover.jpg','Nirvanas debut album.'),

('Parachutes','Coldplay',2000,'https://upload.wikimedia.org/wikipedia/en/f/fd/Coldplay_-_Parachutes.png','Coldplays debut album.'),
('A Rush of Blood to the Head','Coldplay',2002,'https://upload.wikimedia.org/wikipedia/en/6/6e/Coldplay_-_A_Rush_of_Blood_to_the_Head.png','Critically acclaimed Coldplay album.'),
('Viva la Vida or Death and All His Friends','Coldplay',2008,'https://upload.wikimedia.org/wikipedia/en/2/2d/Viva_la_Vida_or_Death_and_All_His_Friends.png','Album featuring the hit song Viva La Vida.');

-- ===============================
-- INSERT TRACKS
-- ===============================

INSERT INTO `TRACK` (`ALBUM_ID`,`NUMBER`,`TITLE`,`LYRICS`,`VIDEO`) VALUES
(1,1,'Hells Bells','Im rolling thunder pouring rain',NULL),
(1,2,'Shoot to Thrill','All you women who want a man of the street',NULL),
(1,3,'Back in Black','Back in black I hit the sack',NULL),

(2,1,'Highway to Hell','Living easy living free',NULL),
(2,2,'Girls Got Rhythm','Ive been around the world',NULL),
(2,3,'Walk All Over You','Outta my way Im running high',NULL),

(3,1,'For Those About to Rock','We roll tonight to the guitar bite',NULL),
(3,2,'Put the Finger on You','Ive been around the world',NULL),

(4,1,'Papercut','Why does it feel like night today',NULL),
(4,2,'One Step Closer','I cannot take this anymore',NULL),
(4,3,'In the End','It starts with one thing',NULL),

(5,1,'Somewhere I Belong','When this began I had nothing to say',NULL),
(5,2,'Faint','I am a little bit of loneliness',NULL),
(5,3,'Numb','Im tired of being what you want me to be',NULL),

(6,1,'What Ive Done','In this farewell theres no blood',NULL),
(6,2,'Bleed It Out','Yeah here we go for the hundredth time',NULL),

(7,1,'Smells Like Teen Spirit','Load up on guns bring your friends',NULL),
(7,2,'Come As You Are','Come as you are as you were',NULL),
(7,3,'Lithium','Im so happy cause today',NULL),

(8,1,'Heart Shaped Box','She eyes me like a Pisces',NULL),
(8,2,'All Apologies','What else should I be',NULL),

(9,1,'About a Girl','I need an easy friend',NULL),

(10,1,'Yellow','Look at the stars look how they shine for you',NULL),
(10,2,'Trouble','Oh no I see a spider web',NULL),

(11,1,'Clocks','Lights go out and I cant be saved',NULL),
(11,2,'The Scientist','Come up to meet you tell you Im sorry',NULL),

(12,1,'Viva La Vida','I used to rule the world',NULL),
(12,2,'Violet Hill','Was a long and dark December',NULL);