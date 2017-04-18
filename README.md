# Fancy4

**Faculty Research Database - Final Project**  
**ISTE 330 01**  
**Team 11 (Fancy 4)**  
## Members
* Andrew Diana
* Brendan McGeever
* Nicholas Rung
* Brendon Strowe

## Instructions

1. **Build the database.** From a MySQL prompt, run the `scripts/CreateDatabase.sql` script to build the database and the `scripts/TestData.sql` to populate it with test data.
2. **Configure your environment to connect to the database.** In the root directory of this project, create a new file called `.env`. The contents of the file should look like the following where `username` and `password` are replaced with the credentials needed to log into your local instance of your MySQL Server.
```
DB_HOST=localhost
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=FacultyResearch
```
3. **Install the dependent Node.js packages.** In a Terminal or Command Prompt window, change the working directory to the root directory of the local copy of this project. Run the command `npm install`.
4. **Run the server.** Run the command `npm start` to start the server.
5. **Run the client.** In a web browser, navigate to `http://localhost:3000/`.
