const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const session = require('express-session');

const routes = require('./controllers');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Session expires in 15 minutes
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        expiration: 15*60*1000
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static pages
app.use(express.static(path.join(__dirname, 'public')));

// Use session in app to track user data
app.use(session(sess));

//  API routes
app.use(routes);

// Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on connection to db and routes
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});