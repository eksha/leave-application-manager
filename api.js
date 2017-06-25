var express = require('express');        // call express
var app = express();                    // define our app using express
var bodyParser = require('body-parser');
var db=require('./database.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use('/static',express.static('static'));

//api to get leave application for employee and manager

app.get('/:username/',function(req,res){
    //check whether the username exists in the database
    db.user.findOne({username:req.params.username},function(err,doc){
      if(err){
        console.log(err);
        res.json({code:-1,message:"Could not retrieve Leave Applications"});
      }
      //if not registered user, don't allow access
      if(doc===null){
        console.log("Unauthentic User");
        res.json({code:-1,message:"Unauthentic Username!"});
      }
      //if registered user
      else{
        console.log(doc);
        //if role is Employee, return the list of previous leave applications
        if(doc.role=="Employee"){
          db.leave.find({requestedBy:req.params.username},function(err,appl){
            if(err){
            console.log(err);
            res.json({code:-1,message:"Could not retrieve Leave Applications"});
            }
            else {
              if(appl.length>0){
              console.log(appl);
              res.json(appl);
                }
              else {
              res.json({code:1,message:"No Leave Application to show!"});
                  }
                }
          });
        }
        //if role is Manager, return the entire list of leave applications
        else if(doc.role=="Manager"){
            //find all leave applications and sort in order of request date
          db.leave.find().sort({requestedAt:-1}).exec(function(err,applications){
            if(err){
              console.log(err);
              res.json({code:-1,message:"Could not retrieve leave application"});
            }
            else{
              if(applications.length>0){
              console.log(applications);
              res.json(applications);
                }
              else {
              res.json({code:1,message:"No Leave Application to show!"});
            }
          }
        });
      }
      }
    });
});

//api to post/submit leave application by employee

app.post('/:username',function(req,res){
  //check whether the username exists in the database
  db.user.findOne({username:req.params.username},function(err,doc){
    if(err){
      console.log(err);
      res.json({code:-1,message:"Internal Error"});
    }
    //if not registered user, don't allow access
    else if(doc===null){
      console.log("Unauthentic User");
      res.json({code:-1,message:"Unauthentic Username!"});
    }
    //if role is Manager, refrain from making POST request
    else if(doc.role=="Manager"){
      console.log("Not authorized");
      res.json({code:-1,message:"Not authorized to make POST request"});
    }
    //if role is Employee, allow POST request
    else{
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
      console.log("Post Successful");
      res.json({code:1,message:"Leave Application Posted Succesfully"})
     }
  });
}

});
});

//api to approve leave application for manager

app.put('/:username/:id',function(req,res){
    //check whether the username exists in the database
  db.user.findOne({username:req.params.username},function(err,doc){
    if(err){
      console.log(err);
      res.json({code:-1,message:"Internal Error"});
    }
    //if not registered user, don't allow access
    else if(doc===null){
      console.log("Unauthentic User");
      res.json({code:-1,message:"Unauthentic Username!"});
    }
    //if role is Employee, refrain from making PUT request
    else if(doc.role=="Employee"){
      console.log("Not authorized");
      res.json({code:-1,message:"Not authorized to make PUT request"});
    }
    //if role is Manager, allow PUT request
    else{
        //update approvalStatus to true and approvedAt to Current date
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
     }
    });
   });

module.exports=app;
