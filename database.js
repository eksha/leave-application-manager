//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://dee:simran97@ds137882.mlab.com:37882/leaveapp';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//define collection names for the database
const USER_DB="User",
      LEAVE_DB="Leave";

var Schema = mongoose.Schema;
//schema for user collection
var User_Schema= new Schema({
  firstname:String,
  lastname:String,
  email:String,
  role:String,
  username:String
});

//schema for leave app collection
var Leave_Schema = new Schema({
  startdate: String,
  enddate:String,
  leavetype:{type: String, enum :['Earned Leave','Sick Leave','Casual Leave','Maternity Leave']},
  reason:{type:String, default:"Not Specified"},
  requestedBy:String,
  requestedAt:String,
  approvalStatus:{type: Boolean, enum:[true, false], default: false },
  approvedAt:String
});

var user= mongoose.model(USER_DB,User_Schema);
var leave =mongoose.model(LEAVE_DB,Leave_Schema);

//export user and leave collections
module.exports={
user,
leave
}
