/**
 * Set up RESTful-style endpoints for URL routing.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy 4)
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/models/Paper');
const PaperKeywords = require('../db/models/PaperKeywords');
const BusinessIndex = require('../business/BusinessIndex');
const Business = new BusinessIndex();

/**
 * Example User object:
 */
// RowDataPacket {
//		id: 5,
//		firstName: 'userlast',
//		lastName: 'userfirst',
//		email: 'username@rit.edu',
//		role: 's',
//		password: '$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'
// }

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/papers');
});

/**
 * Get the Login page.
 * If the requesting client is a logged-in User, redirect them to the Papers page.
 * If not, respond with the Login page and flash any login message (i.e. incorrect credentials).
 */
router.get('/login', (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect('/papers');
  } else {
    res.render('login', {hideNav: true, message: req.flash('loginMessage')});
  }
});

/**
 * Handle a login POST request.
 * Handle authentication using Passport.js
 * A successful login redirects a user to the Papers page.
 * A failed gives the user the login page again with a flash message of
 *  incorrect credentials.
 */
router.post('/login', passport.authenticate('local-login', {
  //Changed to papers to view papers
  successRedirect: '/papers',
  failureRedirect: '/login',
  failureFlash: true,
}));

/**
 * Get the Profile page.
 * The HTTP GET request must be recieved by a logged in user.
 */
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {user: req.user});
});

/**
 * Handle a submit POST request.
 * The HTTP POST request must be recieved by a logged in user or either Admin
 *  or Faculy role.
 * The actual addition of the paper to the Database is handled by
 *  the Business Layer.
 * An error redirects the user to the Home (Papers) page.
 */
router.post('/submit', isLoggedIn, checkRole(['a', 'f']), (req, res) => {

  let title = req.body.title;
  let abstract = req.body.abstract;
  let citation = req.body.citation;

  console.dir({title: title, abstract: abstract, citation: citation});

  let Business = new BusinessIndex();

  Business.submitPaper(title, abstract, citation).then(resultSet => {

    console.dir(resultSet);
    res.render('submit', {title: 'Paper Submission', user: req.user});
  }).catch(error => {

    console.dir(error);
    res.redirect('/');
  });
});

/**
 * Get the Profile page.
 * The HTTP GET request must be recieved by a logged in user or either Admin
 *  or Faculy role.
 */
router.get('/submit', isLoggedIn, checkRole(['a', 'f']), (req, res) => {
  res.render('submit', {title: 'Paper Submission', user: req.user});
});

/**
 * Get the Papers page.
 */
router.get('/papers', (req, res) => {

  Business.getAllPapers().then(resultSet => {

    res.render('papers',
        {title: 'Papers Page', user: req.user, papers: resultSet});
  }).catch(error => {

    console.dir(error);
    res.render('papers',
        {title: 'Papers Page', user: req.user, papers: [], hideNav: true});
  });
});

/**
 * Get a Paper by ID.
 * Take note if the there is an authenticated user of Admin role. This will allow
 *  us to render the page differently for them.
 * The actual retrieval of the paper to the Database is handled by
 *  the Business Layer.
 */
router.get('/paper/:id', (req, res) => {
  let id = req.params.id;
  let admin = false;
  if (req.isAuthenticated()) {
    if (req.user.role === 'a') {
      admin = true;
    }
  }
  Business.getPaper(id).then(result => {
    console.dir(result);
    res.render('paper', {paper: result, admin: admin, user: req.user});
  }).catch(error => {
    console.dir(error);
    res.status(500);
  });
});

/**
 * Logout the user and redirect them to the Home (Pages) page.
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/**
 * Get the SignUp page.
 * If the client is already logged in, redirect them to the Home (Pages) page.
 */
router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('signup', {message: req.flash('signupMessage')});
  }
});

/**
 * Handle the signing-up of a new user.
 *  A successful signup redirects a user to their new Profile page.
 * A failed signup gives the user the signup page again with a flash message of
 *  the error.
 */
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

/**
 * If none of the above routes are received, then the user is requesting a page
 *  which doesn't exist. Return a 404 Not Found page.
 */
router.get('*', (req, res) => {
  res.render('404');
});

/**
 * Create a "Middleware" function i.e. something to be executed in between the
 *  receiving of an HTTP request and the response to that request.
 * Check if there is a logged-in user sending this request.
 *
 * @param req - HTTP Request received.
 * @param res - HTTP Response to eventually send
 * @param  {Function} next - To be called once this Middleware function is finished executing.
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/**
 * Middleware function to check the role of the user sending this request.
 *
 * @param {String} or {Array} - allowable roles.
 */
function checkRole(role) {
  return (req, res, next) => {

    if (typeof role === 'string' && role === req.user.role) {
      next();
    } else if (typeof role === 'object' && role.includes(req.user.role)) {
      next();
    } else {
      res.status(401).redirect('/');
    }
  };
}

// Make the "module" (Class/Object type) available for use in other files.
module.exports = router;
