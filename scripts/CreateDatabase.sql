-- Faculty Research Database - Final Project
-- ISTE 330 01
-- Team 11 (Fancy Four)
-- Script Author: Brendon Strowe


-- Create a fresh Database

DROP DATABASE IF EXISTS FacultyResearch;
CREATE DATABASE FacultyResearch;
USE FacultyResearch;


-- Table creation

CREATE TABLE User (
	id INT UNSIGNED AUTO_INCREMENT,
	firstName VARCHAR(48) NOT NULL,
	lastName VARCHAR(48) NOT NULL,
	email VARCHAR(48),
	role CHAR(1) NOT NULL,
	password VARCHAR(256),
	CONSTRAINT pk_id PRIMARY KEY (id)
);
/*Insert Into User table*/
INSERT INTO User (id,firstName,lastName,email,role,password) 
	VALUES
    (1,'Andrew','Diana','axd7832@rit.edu','a','hashpass'),
    (2,'Nick','Rung','email@rit.edu','f','hashpass'),
    (3,'Brendon','Strowe','email@rit.edu','s','hashpass'),
    (4,'Brendan','McGeever','email@rit.edu','a','hashpass');

CREATE TABLE Papers (
	id INT UNSIGNED AUTO_INCREMENT,
	title VARCHAR(48) NOT NULL,
	abstract TEXT,
	citation VARCHAR(48),
	CONSTRAINT pk_id PRIMARY KEY (id)
);
/*Insert into Papers table*/

INSERT INTO Papers (id,title,abstract,citation) 
	VALUES 
    (1,'Andrew Does Research', 'Andrew Diana reads a textbook','citation?'),
    (2,'Nick Does Research', 'Nick Rung reads a textbook','citation?'),
    (3,'Brendon Does Research', 'Brendon Strowe reads a textbook','citation?'),
    (4,'Brendan Does Research', 'Brendan McGeever reads a textbook','citation?');

CREATE TABLE Authorship (
	userId INT UNSIGNED,
	paperId INT UNSIGNED,
	CONSTRAINT pk_userId_paperId PRIMARY KEY (userId, paperId),
	CONSTRAINT fk_userId_Authorship FOREIGN KEY (userId) REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_paperId_Authorship FOREIGN KEY (paperId) REFERENCES Papers(id) ON UPDATE CASCADE
);
/*Insert into Authorship table*/
INSERT INTO Authorship (userId,paperId)
	VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4);

CREATE TABLE PaperKeywords (
	id INT UNSIGNED AUTO_INCREMENT,
	keyword VARCHAR(48),
	CONSTRAINT pk_id_keyword PRIMARY KEY (id, keyword),
	CONSTRAINT fk_id FOREIGN KEY (id) REFERENCES Papers(id) ON UPDATE CASCADE ON DELETE CASCADE
);

/*Insert Into PaperKeywords table*/
INSERT INTO PaperKeywords (id,keyword)
	VALUES
	(1,'Andrew,Diana,Research'),
    (2,'Nick,Rung,Research'),
    (3,'Brendon,Strowe,Research'),
    (4,'Brendan,McGeever,Research');
    
CREATE TABLE SavedPapers (
	userId INT UNSIGNED,
	paperId INT UNSIGNED,
	CONSTRAINT pk_paperId_userId PRIMARY KEY (paperId, userId),
	CONSTRAINT fk_userId_SavedPapers FOREIGN KEY (userId) REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_paperId_SavedPapers FOREIGN KEY (paperId) REFERENCES Papers(id) ON UPDATE CASCADE ON DELETE CASCADE
);
/*INSERT INTO Saved Papers*/
INSERT INTO SavedPapers (userId, paperId)
	VALUES
    (1,1),
    (1,3),
    (1,2),
    (1,4);

