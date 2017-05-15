/* Faculty Research Database - Final Project
   ISTE 330 01
   Team 11 (Fancy 4)
   Script Author: Andrew Diana
*/

/*Insert Into Users table*/
INSERT INTO Users (id,firstName,lastName,email,role,password)
	VALUES
    (1,'Andrew','Diana','axd7832@rit.edu','a','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'),
    (2,'Nick','Rung','nxr8475@rit.edu','f','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'),
    (3,'Brendon','Strowe','brendan.strowe@rit.edu','s','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'),
    (4,'Brendan','McGeever','btm4810@rit.edu','a','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'),
    (5,'userlast','userfirst','username@rit.edu','s','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'),
    (6,'Flo','Pro','flobot@rit.edu','f','$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha');

/*Insert into Papers table*/
INSERT INTO Papers (id,title,abstract,citation)
	VALUES
    (1,'Big Data: Using Smart Big Data', 'Andrew Diana reads a textbook','Andrew wrote this.'),
    (2,'Advanced Computing, Networking, and Infomatics', 'Nick Rung reads a textbook','Nick wrote this.'),
    (3,'Node.js: NPM Modules', 'Brendon Strowe reads a textbook','Brendon wrote this.'),
    (4,'Medical Infomatics', 'Brendan McGeever reads a textbook','Brendan wrote this.'),
    (5,'Infomatics in Radiology (infoRAD)', 'Erica Parker reads a textbook','userfirst wrote this.'),
    (6,'Mobile Computing: Securing Your Workforce', 'Jimmy John reads a textbook','Flo Bot wrote this.'),
    (7,'Essentials of Database Management, Data Analysis, and Staff Training', 'Peter Potter reads a textbook','Andrew wrote this.'),
    (8,'Programming elastic MapReduce: Usings AWS Services', 'Jacob Risenger reads a textbook','Nick wrote this.'),
	(9,'Virtualization Security: Protecting Virtualized Environments', 'Jason Lamb reads a textbook','Brendon wrote this.'),
	(10,'Erin Does Research', 'Erin McGeever reads a textbook','Brendan wrote this.');

/*Insert into Authorship table*/
INSERT INTO Authorship (userId,paperId)
	VALUES
    (1,1),
    (1,7),
    (2,2),
    (2,8),
    (3,3),
    (3,9),
    (4,4),
    (4,10),
    (5,5),
    (6,6);

/*Insert Into PaperKeywords table*/
INSERT INTO PaperKeywords (paperId,keyword)
	VALUES
	(1,'Andrew'),
	(1,'Diana'),
	(1,'Research'),
    (2,'Nick'),
	(2,'Rung'),
	(2,'Research'),
    (3,'Brendon'),
	(3,'Strowe'),
	(3,'Research'),
    (4,'Brendan'),
	(4,'McGeever'),
	(4,'Research');

/*INSERT INTO Saved Papers*/
INSERT INTO SavedPapers (userId, paperId)
	VALUES
    (1,1),
    (1,3),
    (1,2),
    (1,4);

