var express = require('express'),
    router = express.Router(),
    passportsec = require('passport')
    config = require('../config/config.js')

var facebook = "no";

router.get('/',function (req,res) {
    res.render('index',{heading:'Welcome to chat Server'})
})

function securepage(req,res,next)
{
    if (req.sessionStore.sessions)
    {
        var jsonform;
        for (i in req.sessionStore.sessions)
        {

            jsonform = JSON.parse(req.sessionStore.sessions[i]).passport.user;
        }
        if(jsonform)
        {
            next();
        }
    }
    else {
            res.redirect('/');
        }
}


router.get('/setsession',function (req,res) {
    req.session.mycolor = "Red"
    res.send("Session is Set")

});

router.get('/getsession',function (req,res) {
    res.send("Color  is " + (req.session.mycolor))
});


router.get('/auth/facebook',passportsec.authenticate('facebook'))
router.get('/auth/google',passportsec.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/facebook/callback',passportsec.authenticate('facebook',{ failureRedirect:'/failure'}),
   function (req,res) {
       facebook = "yes";
       res.redirect('/chatroom');
   });

router.get('/auth/google/callback', passportsec.authenticate('google', { failureRedirect: '/failure' }),
    function(req, res) {
        facebook = "no";
        res.redirect('/chatroom');
    });




router.get('/chatroom', securepage,function (req,res) {

    if(facebook=="no")
    {
         var jsonform;
        for(i in req.sessionStore.sessions)
        {
            jsonform = JSON.parse(req.sessionStore.sessions[i]).passport.user;
        }
        console.log(req)
        res.render('chatroom',{user:jsonform,config:config});
    }
    else
    {
        console.log(req)
        res.render('chatroom',{user:req.user,config:config});
    }
   
    
});

router.get('/logout',function (req,res) {
    req.logout()
    res.redirect('/')
})


router.get('/failure',function (req,res) {
    res.render('failure');
});


module.exports = router