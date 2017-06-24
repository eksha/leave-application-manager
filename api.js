var express = require('express');        // call express
var app = express();                    // define our app using express
var bodyParser = require('body-parser');
var db=require('./database.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//api to get and post leave application for employees
app.get('/employee/:username',function(req,res){

   db.leave.find({requestedBy:req.params.username},function(err,doc){
     if(err){
     console.log(err);
     res.json({code:-1,message:"Could not retrieve Leave Applications"});
     }
     if(doc.length>0){
       console.log(doc);
       res.json(doc);
     }
     else {
       res.json({code:1,message:"No Leave Application to show!"});
     }
   });
});


app.post('/employee/:username',function(req,res){
  console.log(req.body);
  var newleave = new db.leave(req.body);
  newleave.requestedBy=req.params.username;
  newleave.requestedAt= new Date();
  newleave.save(function(err){
    if(err){
      console.log(err);
      res.json({code:-1,message:"Could not Post the leave Application"});
      }
    else {
      console.log("post Successful");
      res.json({code:1,message:"Leave Application Posted Succesfully"})
     }

  });

});

//api to get  and approve leave application for manager

app.get('/manager',function(req,res){

  db.leave.find().sort({requestedAt:-1}).exec(function(err,applications){
    if(err){
      console.log(err);
      res.json({code:-1,message:"Could not retrieve leave application"});
    }
    else{
      console.log(applications);
      res.json(applications);
    }
});
});

app.put('/manager/:id',function(req,res){

db.leave.update({_id:req.params.id},{approvalStatus:true,approvedAt:new Date()},function(err){
  if(err){
    console.log(err);
    res.json({code:-1,mesage:"Could not approve leave Application"});
  }
  else{
    console.log("Put Successfuly");
    res.json({code:1,message:"Approved Leave Application id: "+req.params.id});
  }

});

});

module.exports=app;
