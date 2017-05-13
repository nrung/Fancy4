/**
 * Handle user authentication.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy Four)
 * @author Nick Rung
 * @version 17 of April 2017
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const MySQLDatabase = require('../db/MySQLDatabase');

module.exports = passport => {

	// Configure Passport authenticated session persistence.
//
	/**
	 * In order to restore authentication state across HTTP requests,
	 *  Passport.js needs to serialize users into and deserialize users out of
	 *  the session. Here, the user is serialized based on its ID.
	 *
	 * @param {User} user - Application User to be serialized.
	 * @param {function} done - Callback function of Passport.js to be called
	 *  upon completion of serialization operaiton.
	 */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

	/**
	 * Deserialize the user of the application.
	 *  Fetch a User from the database based on its ID number. This will
	 *  identify the user for this connection session.
	 *
	 * @param {number} id - ID of a User to be deserialized.
	 * @param {function} done - Callback function of Passport.js to be called
	 *  upon completion of deserialization operaiton.
	 */
    passport.deserializeUser((id, done) => {

        MySQLDatabase.getData("SELECT * FROM users WHERE id = ?", [id]).then(resultSet => {
            done(null, resultSet.rows[0]);
        }).catch(error => {
            done(error);
        });
    });

	/**
	 * User login is handled "locally" i.e. through a database on the same
	 *  server rather than an external login service. The "Local Strategy"
	 *  requires a function which receives the credentials ('username' and
	 *  'password') submitted by the user. The function must verify that the
	 *  password is correct and then invoke `done` with a user object.
	 */
    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true, // Allows us to pass back the entire request to the callback/done function
        },
        (request, username, password, done) => {
            MySQLDatabase.getData("SELECT * FROM users WHERE email = ?", [username]).then(resultSet => {

                let user = resultSet.rows[0];

				// Check if the username supplied exists in the database already.
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'Invalid credentials.'));
                }
				// Check if the password supplied was correct.
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, req.flash('loginMessage', 'Invalid credentials.'));
                }
				// If the username and password are correct, supply Passport.js with the user object.
                return done(null, user);
            });
        }
	));

	/**
	 * Handle sign-ups "locally" i.e. through a database on the same
	 *  server rather than an external login service.
	 * Check if the user trying to sign up already exists. If not, create the
	 * 	user's account.
	 */
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // Allows us to pass back the entire request to the callback/done function
        }, (req, username, password, done) => {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            MySQLDatabase.getData("SELECT * FROM users WHERE email = ?", [username]).then(resultSet => {
                if (resultSet.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    let newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        role: 's'
                    };

                    let insertQuery = "INSERT INTO users ( email, password, firstname, lastname, role ) values (?,?,?,?,?)";

                    MySQLDatabase.setData(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.firstname, newUserMysql.lastname, newUserMysql.role]).then(resultSet => {
                        newUserMysql.id = resultSet.insertId;

                        return done(null, newUserMysql);

                    }).catch(error => {
                        // Error from inserting new user into users table
                        console.log(error);
                        return done(error);
                    });
                }
            }).catch(error => {
                // Error from querying if user exists
                return done(error);
            });
        })
    );
};
