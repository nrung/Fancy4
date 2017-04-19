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

module.exports = function(passport) {
// used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

// used to deserialize the user
    passport.deserializeUser(function (id, done) {

        MySQLDatabase.getData("SELECT * FROM users WHERE id = ?", [id]).then(function (resultSet) {
            done(null, resultSet[0]);
        }).catch(function (error) {
			done(error);
		});
    });


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            MySQLDatabase.getData("SELECT * FROM users WHERE email = ?", [username]).then(function (resultSet) {
				if (resultSet.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    let newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, "SaltySaltSaltSalt")  // use the generateHash function in our user model
                    };

                    let insertQuery = "INSERT INTO users ( email, password ) values (?,?)";

                    MySQLDatabase.setData(insertQuery, [newUserMysql.username, newUserMysql.password]).then(function (resultSet) {
                        newUserMysql.id = resultSet.insertId;

                        return done(null, newUserMysql);

					}).catch(function(error) {
						// Error from inserting new user into users table
                        console.log(error);
						return done(error);
                    });
                }
			}).catch(function (error) {
				// Error from querying if user exists
				return done(error);
			});
        })
    );
};
