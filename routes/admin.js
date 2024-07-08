var express = require('express');
var router = express.Router();
const admin=require("../Models/adminSchema")
const users= require("../Models/Schema")
/* GET users listing. */
router.get('/',  async(req, res,)=> {
  try {
    if(req.session.admin){
      const username= await users.findOne({email:req.session.admin})
      console.log(username)
      const admins= await users.find({})
     return res.render('adminpage',{admins,username})
    }
    res.render("adminlogin")
   
   
  } catch (error) {
    
  }
 
});

router.get('/signup', (req,res)=>{
  res.render('adminsignup')
})

router.post('/signup',async(req,res)=>{
 await admin.create({
  firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password
 })
 return res.redirect('/admin')
})

router.post("/signin",async(req,res)=>{
  const admins= await admin.findOne({email:req.body.email})
  try {
    if(admins.password===req.body.password && admins.email===req.body.email){
      req.session.admin=admins.email
      res.redirect('/admin')
   }
   else{
     console.log("Invalid Credentials")
   }
  } catch (error) {
    console.log(error)
  }

})

router.get("/edit",async(req,res)=>{
  if(req.session.admin){
    console.log(req.query.id)
    const id =req.query.id
  const user= await users.findOne({_id:id})
  console.log(user)
    res.render("edituser", {user})
  }
})

router.post("/edit",async(req,res)=>{
  const id=req.query.id
const user= await users.findOne({_id:id})
if(user){
  user.firstname=req.body.firstname,
  user.lastname=req.body.lastname,
  user.email=req.body.email
 await user.save()
}
return res.redirect("/admin")
})

router.get("/adduser",(req,res)=>{
  if(req.session.admin)
  res.render("adduser")
else
res.redirect("/admin")
})


router.post("/adduser",async(req,res)=>{
  try {
    const loguser= await users.find({})
    console.log("log user")
    console.log(loguser)
    await users.create({
      firstname: req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password
    }).then(()=>{
      res.status(200).redirect("/admin")
    })
  } catch (error) {
    console.log(error)
  }
 
})

router.post("/delete/:id", async(req,res)=>{
  try {
    const id=req.params.id
    const user= await users.findOne({_id:id})
    console.log(user)
    if(user){
      users.deleteOne({_id:id}).then(()=>{
        return res.redirect("/admin")
      })
    }
  } catch (error) {
    console.log(error)
  }
})



router.get('/logout', (req,res)=>{
req.session.destroy()
res.redirect("/admin")
})

module.exports = router;



/*
if(req.session.user){
  const users= await user.find()
  console.log(users)
  res.render('adminpage',{profiles:users}) }
*/