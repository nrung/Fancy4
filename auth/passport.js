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

module.exports = (passport) => {
// used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

// used to deserialize the user
    passport.deserializeUser((id, done) => {

        MySQLDatabase.getData("SELECT * FROM users WHERE id = ?", [id]).then(function (resultSet) {
            console.dir(resultSet.rows[0]);
            done(null, resultSet.rows[0]);
        }).catch(function (error) {
            done(error);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, username, password, done) {
            MySQLDatabase.getData("SELECT * FROM users WHERE email = ?", [username]).then(function (resultSet) {

                let user = resultSet.rows[0];

                if (!user) {
                    console.log('no user');
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    console.log('bad pass');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                }
                return done(null, user);
            });
        }));


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
                        password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        role: 'S'
                    };

                    let insertQuery = "INSERT INTO users ( email, password, firstname, lastname ) values (?,?,?,?)";

                    MySQLDatabase.setData(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.firstname, newUserMysql.lastname]).then(function (resultSet) {
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
