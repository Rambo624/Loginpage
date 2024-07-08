var express = require('express');
var router = express.Router();
const users= require("../Models/Schema")

const noCache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};


/* GET home page. */
router.get('/',noCache, function(req, res, next) {
  
  if(!req.session.user){
   return res.redirect('/login')
  }
    res.render('home');
  });


  router.get("/login",(req,res)=>{
    res.render("login_page")
  })

  router.get("/signin",(req,res)=>{
    if(req.session.user){
      return res.redirect("/")
    }
  })

router.post("/signin",noCache,async(req,res)=>{
  
  
  try {
    const loguser= await users.findOne({email:req.body.email})
    if(loguser.password===req.body.password && loguser.email===req.body.email){
      req.session.user=loguser.email
      console.log("session user:" +req.session.user)
     return  res.render("home")
    }
    else{
      console.log("invalid credentials")
    }
  } catch (error) {
    console.log(error)
  }
})

router.get("/signup",(req,res)=>{
  res.render("signup_page")
})

router.post("/adduser",async(req,res)=>{
  
  try {
    const user= await users.findOne()
    await users.create({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password
    }).then(()=>{
      return res.redirect("/")
    })
    
  } catch (error) {
    
  }
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/')

})




module.exports = router;
