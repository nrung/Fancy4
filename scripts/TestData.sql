/* Faculty Research Database - Final Project
   ISTE 330 01
   Team 11 (Fancy 4)
   Script Author: Andrew Diana
*/

/*Insert Into Users table*/
INSERT INTO Users (id,firstName,lastName,email,role,password)
	VALUES
    (1,'Andrew','Diana','axd7832@rit.edu','a','hashpass'),
    (2,'Nick','Rung','email@rit.edu','f','hashpass'),
    (3,'Brendon','Strowe','email@rit.edu','s','hashpass'),
    (4,'Brendan','McGeever','email@rit.edu','a','hashpass');

	/*Insert into Papers table*/

INSERT INTO Papers (id,title,abstract,citation)
	VALUES
    (1,'Andrew Does Research', 'Andrew Diana reads a textbook','citation?'),
    (2,'Nick Does Research', 'Nick Rung reads a textbook','citation?'),
    (3,'Brendon Does Research', 'Brendon Strowe reads a textbook','citation?'),
    (4,'Brendan Does Research', 'Brendan McGeever reads a textbook','citation?')
    (5,'Erica Does Research', 'Erica Diana reads a textbook','citation?'),
    (6,'Jimmy Does Research', 'Jimmy Rung reads a textbook','citation?'),
    (7,'Peter Does Research', 'Peter Strowe reads a textbook','citation?'),
    (8,'Jacob Does Research', 'Jacob McGeever reads a textbook','citation?')
	(9,'Jason Does Research', 'Jason McGeever reads a textbook','citation?')
	(10,'Erin Does Research', 'Erin McGeever reads a textbook','citation?');

/*Insert into Authorship table*/
INSERT INTO Authorship (userId,paperId)
	VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4);

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
