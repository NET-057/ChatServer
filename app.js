var express = require('express'),
    http = require('http'),
    app  = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    connectmongo = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    Schemaa = mongoose.Schema,
    passport = require('passport'),
    mysocket = require('./socket/socket.js'),
    facebookstrategy = require('passport-facebook').Strategy
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    all_messages = []
    onlineuserar = []
    totalsocket = []

mongoose.connect(config.dburl)
app.set('port',process.env.PORT || '8000')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

if(env==='development')
{
    app.use(session({secret:config.sessionsecret,saveUninitialized:true,resave:true}))

}
else
{
    app.use(session({
        secret:config.sessionsecret,
        saveUninitialized:true,
        resave:true,
        store: new connectmongo({
            // mongoose_connection:mongoose.connections[0],
            url:config.dburl,
            stringify:true
        })
    }));

}

app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require('./routes/index');
var passportauth = require('./auth/passport');

passportauth.facebookauth(passport,facebookstrategy,config,mongoose);
passportauth.googleauth(passport,GoogleStrategy,config,mongoose);


app.use(indexRouter)


// app.use(function(req, res, next){
//     res.locals.showTests = app.get('env') !== 'production' &&
//         req.query.test === '1';
//     next();
// });

app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// app.listen(app.get('port'),function (req,res) {
//     console.log("server is listening");
//     console.log(env);
// })

all_messages.length = 0

var server = http.Server(app);
var io = require('socket.io')(server);
mysocket.chatsocket(io,all_messages,onlineuserar,totalsocket);


server.listen(app.get('port'),function (req,res) {
    console.log("Chat is running on port "+ app.get('port'));
    console.log(env)
});