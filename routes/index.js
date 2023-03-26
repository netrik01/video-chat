var express = require('express');
var router = express.Router();
const uuid = require("uuid");
const multer = require('multer')
const config = require('../config/config')
const userModel = require("./users")
require("dotenv").config()
const passport = require('passport');
const localStrategy=require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))
var GoogleStrategy = require('passport-google-oidc');


// -----------check-image-formate-----------

function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp' || file.mimetype === 'image/jfif') {
      cb(null, true);
  }
  else {
    cb(new Error('Change the image formate !'))
  }
}
const UserImageupload = multer({ storage: config.userImageStorage, fileFilter: fileFilter })

// -----------peer-route-----------
// peer code=>note.txt

// -----------primary-route-----------

router.get('/',redirectToProfile, (req, res)=>{
  res.render('index')
})

// -----------user-register-route-----------

router.post('/register', async function(req,res){
  var userDets=new userModel({
    username: req.body.username,
    email: req.body.email,
  })
 await  userModel.register(userDets, req.body.password)
  passport.authenticate('local')(req, res, function(){
    res.redirect("back")
  })
});  


// -----------user-login-logout-route-----------

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect: "/"
}),function(req,res){})

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/')
  })
})


// -----------secondary-route-----------

router.get('/profile',isLoggedIn, async (req,res)=>{
  let user= await userModel.findOne({username:req.session.passport.user})
  res.render('profile',{user})
})
router.get('/meeting',isLoggedIn,async (req,res)=>{
  let user= await userModel.findOne({username:req.session.passport.user})
  res.render('join',{user})
})

router.get('/join',isLoggedIn, async(req,res)=>{
  let roomId= `${uuid.v1()}`;
  let data={
    roomId: roomId,
  }
  let updateuser= await userModel.findOneAndUpdate({username:req.session.passport.user},data)
  let user= await userModel.findOne({username:req.session.passport.user})
  res.render('join',{user})
})

router.post("/update" ,isLoggedIn, async (req,res)=>{
  let data={
    username:req.body.username,
    displayname:req.body.displayname,
    contact:req.body.contact,
    country:req.body.country,
  }
  let updatedUser = await userModel.findOneAndUpdate({username:req.session.passport.user},data)
  res.redirect('/profile');
})

router.post("/image" ,isLoggedIn, UserImageupload.single('image'), async (req,res)=>{
  let data={
    image:req.file.filename
  }
  let user = await userModel.findOneAndUpdate({username:req.session.passport.user},data)
  await user.save();
  res.redirect('/profile');
})


// -----------room-route-----------

router.get('/room',isLoggedIn, async (req,res)=>{
  let roomId=req.query.room;
  res.redirect(`/${roomId}`)
})

// router.get('/:room',isLoggedIn, async (req,res)=>{
//   let user=await userModel.findOne({username:req.session.passport.user})
//   if(user.roomId === req.params.room){
//     res.render('room',{roomID:req.params.room})
//   }else{
//     res.send("Please check the roomID once again !")
//     // res.send("Great, but it can't work anymore!")
//     // res.redirect('/')
//   }
// })
router.get('/:room', async (req,res)=>{
  res.render('room',{roomID:req.params.room})
})

// -----------login-with-google-----------

router.get('/login/federated/google', passport.authenticate('google'));

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email','profile' ]
}, function verify(issuer, profile, cb) {
     console.log(profile);
     userModel.findOne({email:profile.emails[0].value},(err,user)=>{
        if(user){
          return cb(null,user)
        }else{
          userModel.create({
            username:profile.displayName,
            email:profile.emails[0].value
          })
        }
     })
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));


// -----------check-authenticate-----------

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/')
  }
}

function redirectToProfile( req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/profile')
  }else{
    return next();
  }
}

module.exports = router;