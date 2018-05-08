module.exports = {

    facebookauth : function (passport,facebookstrategy,config,mongoose) {

        var chatuser = new mongoose.Schema({
            profileid:String,
            full_name:String,
            profilepic:String
        });

        var usermodel = mongoose.model('chatuser',chatuser);

        passport.serializeUser(function(user,done) {
            done(null,user);
        });

        passport.deserializeUser(function(id,done) {
            usermodel.findById(id,function (err,user) {
                done(err,user);
            })
        })

        passport.use(new facebookstrategy({
            clientID: config.fb.appId,
            clientSecret: config.fb.appsecret,
            callbackURL: config.fb.callback,
            // profileFields: ['id','displayName','photos']
        },function (accessToken,resfreshToken,profile,done) {

            usermodel.findOne({"profileid":profile.id},function (err,result) {
                console.log(profile)
                if(result)
                {
                    done(null,result);
                }
                else
                {
                    var newchatuser = new usermodel({
                        profileid:profile.id,
                        full_name:profile.displayName,
                        profilepic:profile.photos ? profile.photos[0].value : '/image/dileep.jpg'
                    });

                    newchatuser.save(function (err) {
                        done(null,newchatuser);
                    })
                }
            })
        }))

    },

    googleauth: function(passport,googlestrategy,config,mongoose) {

        var chatusergoogle = new mongoose.Schema({
            profileid:String,
            full_name:String,
            profilepic:String
        });

        var usermodelgoogle = mongoose.model('chatusergoogle',chatusergoogle);

        passport.serializeUser(function(user,done) {
            done(null,user);
        });

        passport.deserializeUser(function(id,done) {
            usermodelgoogle.findById(id,function (err,user) {
                done(err,user);
            })
        })

        passport.use(new GoogleStrategy({
            clientID: config.google.appId,
            clientSecret: config.google.appsecret,
            callbackURL: config.google.callback,
            // profileFields: ['id','displayName','photos']
        },
            function(accessToken, refreshToken, profile, done) {
                usermodelgoogle.findOne({ profileid: profile.id }, function (err, user) {

                    console.log(profile)

                    if(user)
                    {
                        done(null,user);
                    }
                    else
                    {
                        var newchatusergoogle = new usermodelgoogle({
                            profileid:profile.id,
                            full_name:profile.displayName,
                            profilepic:profile.photos ? profile.photos[0].value : '/image/dileep.jpg'
                        });

                        newchatusergoogle.save(function (err) {
                            done(null,newchatusergoogle);
                        })
                    }

                });
            }));

    }
}