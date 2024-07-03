const express= require("express");
const router = express.Router();

const userModel= require("../models/user.models.js");

router.get("/",(req,res)=>{
  res.send(`Assalamo alaikum <br> <a style=" height:60px; width: 300px ; background : red ; color : #fff; text-decoration: none; padding: 30px; border-radius : 15px ; font-size : 2.76rem; display: flex;justify-content: center;align-items: center; position: absolute; top: 50%;left: 50%; transform: translate(-50%,-50%)" href="/create">Create User</a>`);
});
router.get("/create",async (req,res)=>{
  const createdauser = await userModel.create({
    username : "ahmadraza",
    email:"ahmad@gmail.com",
    password: "ahmad",
    fullName: "Ahmad Raza Khan",
    
  });
  res.send(createdauser);
});

module.exports = router;