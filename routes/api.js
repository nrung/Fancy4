/**
 * Set up RESTful-style endpoints for URL routing for our Paper API.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy 4)
 */

const express = require('express');
const router = express.Router();

const MySQLDatabase = require('../db/MySQLDatabase.js');
const User = require('../db/models/User.js');
const Paper = require('../db/models/Paper.js');
const PaperKeywords = require('../db/models/PaperKeywords');
const BusinessAPI = require('../business/BusinessAPI');
const Business = new BusinessAPI();

/**
 * Get a User by ID.
 * Respond approprately of either a successful result or a
 *  failure with a proper message.
 */
router.get('/:id', function(request, response) {
  let requestedUser = new User(request.params.id);

  // Fetch the reqed user. Respond with data about the user.
  //  If there is an error, catch it and report it.
  requestedUser.fetch().then(() => {
    response.send(requestedUser.id + ' ' + requestedUser.firstName + ' ' +
        requestedUser.lastName);
  }).catch(error => {
    response.send(error);
  });
});

/**
 * Search for a paper.
 * Get the type of search to be executed and the query to be executed from the
 *  HTTP POST request body (from the HTML page contents).
 * Respond to the user approprately of either a successful result or a
 *  failure with a proper message.
 */
router.post('/search', (request, response) => {
  const type = request.body.type.substr(0, 75);
  const query = request.body.query.substr(0, 75);

  Business.searchPapers(type, query).then(papers => {
    response.status(200).json({papers: papers, message: 'Success!'});
  }).catch(error => {
    console.log(error);
    response.status(400);
  });
});

/**
 * Get a Paper by ID.
 * The HTTP GET request must be recieved by a logged in user.
 * Respond approprately of either a successful result or a
 *  failure with a proper message.
 */
router.get('/papers/:id', isLoggedIn, (request, response) => {
  let requestedPaper = new Paper(request.params.id);

  // Fetch the reqed paper. Respond with data about the paper.
  //  If there is an error, catch it and report it.
  requestedPaper.fetch().then(() => {
    response.send(requestedPaper.id + ' ' + requestedPaper.title);
  }).catch(error => {
    response.send(error);
  });
});

/**
 * Get a Paper's keywords by the Paper's ID.
 * The HTTP GET request must be received by a logged in user.
 * Respond appropriately of either a successful result or a
 *  failure with a proper message.
 */
router.get('/papers/:id/keywords', isLoggedIn, (request, response) => {
  let reqedPaperKeywords = new PaperKeywords(request.params.id);

  // Fetch the reqed paper. Respond with data about the paper.
  //  If there is an error, catch it and report it.
  reqedPaperKeywords.fetch().then(() => {
    response.send(
        reqedPaperKeywords.paperId + ' ' + reqedPaperKeywords.keywords);
  }).catch(error => {
    response.send(error);
  });
});

/**
 * Delete a paper by ID.
 * HTTP DELETE request must be received by a logged in user and must
 *  have the role of Admin ('a').
 * Respond to the user appropriately of either a successful paper deletion or a
 *  failure with a proper message.
 */
router.delete('/paper/:id', isLoggedIn, checkRole('a'), (request, response) => {
  let paperId = request.params.id;

  Business.removePaper(paperId).then(result => {
    if (result === 1) {
      request.flash('papersMessage', 'Paper Deleted.');
      response.status(200).json({message: 'Paper Deleted.'});
    } else if (result === 0) {
      response.status(400).json({message: 'Bad request'});
    } else {
      response.status(500).json({message: 'Internal Server Error'});
    }
  }).catch(error => {
    console.log(error);
    response.status(500);
  });
});

/**
 * Modify a paper by ID.
 * HTTP PUT request must be received by a logged in user and must
 *  have the role of Admin ('a').
 * Respond to the user appropriately of either a successful paper modification
 *  or a failure with a proper message.
 */
router.put('/paper/:id', isLoggedIn, checkRole('a'), (request, response) => {
  let paperId = request.params.id;
  console.log(request.body);

  let title = request.body.title.substring(0, 100);
  let abstract = request.body.abstract.substring(0, 1000);
  let citation = request.body.citation.substring(0, 1000);


  Business.modifyPaper(paperId, title, abstract, citation).then(result => {
    console.dir(result);
    if (result === 1) {
      request.flash('papersMessage', 'Paper Modified.');
      response.status(200).json({message: 'Paper modified.'});
    } else if (result === 0) {
      response.status(400).json({message: 'Bad request'});
    } else {
      response.status(500).json({message: 'Internal Server Error'});
    }
  }).catch(error => {
    console.log(error);
    response.status(500);
  });
});

/**
 * Create a "Middleware" function i.e. something to be executed in between the
 *  receiving of an HTTP request and the response to that request.
 * Check if there is a logged-in user sending this request.
 *
 * @param request - HTTP Request received.
 * @param response - HTTP Response to eventually send
 * @param  {Function} next - To be called once this Middleware function is finished executing.
 */
function isLoggedIn(request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/');
}

/**
 * Middleware function to check the role of the user sending this request.
 *
 * @param {String} or {Array} - allowable roles.
 */
function checkRole(role) {
  return (request, response, next) => {

    if (typeof role === 'string' && role === request.user.role) {
      next();
    } else if (typeof role === 'object' && role.includes(request.user.role)) {
      next();
    } else {
      response.redirect(401, '/');
    }
  };
}

module.exports = router;
