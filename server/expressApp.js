const express = require('express')
const app = express()
const path = require('path')
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override")
const router = require('./router/router')
const cors = require('cors')
const db = require('../server/db/index')
const redis = require('redis')
const cookieParser = require('cookie-parser')
    //const connectRedis = require('connect-redis');
const { default: RedisStore } = require('connect-redis');
//const redisStore = connectRedis(session)
const RedisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

let appn = function(control) {

    const initializePassport = require("./authentication/passportConfig");
    initializePassport(
        passport,
        (email) => db.findUserByEmail(email),
        (id) => db.findUserById(id)
    );


    app.use(express.static(path.join(__dirname, './build')))


    app.use(express.urlencoded({ extended: false }));
    app.use(express.json())

    // app.use(cookieParser())
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "8unto0n4oc7903zm",
            resave: true,
            saveUninitialized: true,
            cookie: {
                httpOnly: false,
                maxAge: 8.64e+7
            }
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash())
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000'
    }))

    // app.use(function(req, res, next) {
    //     res.locals.success_msg = req.flash('success_msg');
    //     res.locals.error_msg = req.flash('error_msg');
    //     res.locals.error = req.flash('error');
    //     next();
    // });

    app.use(methodOverride("_method"));
    app.use("/users", router)


    app.get('/addnew', (req, res) => {
        control.addSystem('bachy', {
            port: 5000,
            host: 'localhost',
            name: 'batchy',
            resetOptions: true,
            resetInterval: 2000,
            onError: () => {},
            onConnect: () => {}
        }).attachSystems()
        res.send('tried oing so')
    })

    return app
}
module.exports = appn