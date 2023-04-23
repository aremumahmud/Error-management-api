const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
let {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("../authentication/utils");
const passport = require("passport");

let router = express.Router();

router.route("/dashboard").get(checkAuthenticated, (req, res) => {
    // console.log(req.sessionStore, req.user)
    res.json({
        auth: req.user,
    });
});

router
    .route("/login")
    .get(checkNotAuthenticated, (req, res) => {
        // console.log(req.session)
        // console.log(req.sessionStore.sessions)
        // let sessionKeys = Object.keys(req.sessionStore.sessions)
        // let session = req.sessionStore.sessions[sessionKeys[sessionKeys.length - 1]]
        // console.log(req.session)
        res.send({ login: true });
    })
    .post(checkNotAuthenticated, (req, res, next) => {
        console.log("kz,mjmxn xn xk ikxn xm");
        passport.authenticate("local", (err, theUser, failure) => {
            if (err) {
                return res.json({
                    error: true,
                });
            }
            if (!theUser) {
                return res.json({
                    error: true,
                });
            }
            req.login(theUser, (err) => {
                if (err) {
                    return res.json({
                        errors: err,
                    });
                }
                console.log(req.isAuthenticated());
                res.json({
                    errors: false,
                    user: theUser,
                });
            });
        })(req, res, next);
    });

router
    .route("/register")
    .get(checkNotAuthenticated, (req, res) => {
        let err = req.query.error;
        if (err == "exist") {
            return res.json({ error: "User exists!" });
        } else if (err == "unknown") {
            return res.json({ error: "an unexpected error occured" });
        }
        return res.json({ error: null });
    })
    .post(checkNotAuthenticated, async(req, res) => {
        try {
            let { email, password, username } = req.body;
            console.log(req.body);
            if (!(email && password && username)) {
                return res.json({
                    error: "missing credentials",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            db.createUser(email, username, hashedPassword)
                .then((user) => {
                    res.redirect("/users/login");
                })
                .catch((e) => {
                    console.log(e);
                    res.redirect("/users/register?error=exist");
                });
        } catch (e) {
            console.log(e);
            res.redirect("/users/register?error=unknown");
        }

        // check if the user is successfully added to array
        // console.log(users);o
    });

router.route("/logout").delete((req, res) => {
    req.logOut(() => {});
    res.redirect("/users/login");
});

module.exports = router;