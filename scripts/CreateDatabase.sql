-- Faculty Research Database - Final Project
-- ISTE 330 01
-- Team 11 (Fancy 4)
-- Script Author: Brendon Strowe


-- Create a fresh Database

DROP DATABASE IF EXISTS FacultyResearch;
CREATE DATABASE FacultyResearch;
USE FacultyResearch;


-- Table creation

CREATE TABLE Users (
	id INT UNSIGNED AUTO_INCREMENT,
	firstName VARCHAR(48) NOT NULL,
	lastName VARCHAR(48) NOT NULL,
	email VARCHAR(48),
	role CHAR(1) NOT NULL,
	password VARCHAR(256),
	CONSTRAINT pk_id PRIMARY KEY (id)
);

CREATE TABLE Papers (
	id INT UNSIGNED AUTO_INCREMENT,
	title VARCHAR(200) NOT NULL,
	abstract TEXT,
	citation VARCHAR(200),
	CONSTRAINT pk_id PRIMARY KEY (id)
);

CREATE TABLE Authorship (
	userId INT UNSIGNED,
	paperId INT UNSIGNED,
	CONSTRAINT pk_userId_paperId PRIMARY KEY (userId, paperId),
	CONSTRAINT fk_userId_Authorship FOREIGN KEY (userId) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_paperId_Authorship FOREIGN KEY (paperId) REFERENCES Papers(id) ON UPDATE CASCADE
);

CREATE TABLE PaperKeywords (
	paperId INT UNSIGNED,
	keyword VARCHAR(48),
	CONSTRAINT pk_paperId_keyword PRIMARY KEY (paperId, keyword),
	CONSTRAINT fk_id FOREIGN KEY (paperId) REFERENCES Papers(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE SavedPapers (
	userId INT UNSIGNED,
	paperId INT UNSIGNED,
	CONSTRAINT pk_paperId_userId PRIMARY KEY (paperId, userId),
	CONSTRAINT fk_userId_SavedPapers FOREIGN KEY (userId) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_paperId_SavedPapers FOREIGN KEY (paperId) REFERENCES Papers(id) ON UPDATE CASCADE ON DELETE CASCADE
);
