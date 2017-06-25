# leave-application-manager
NodeJS app to handle **leave application submission and approval**.

The App involves APIs for two roles of users : _Employee_ and _Manager_.

## Start the app
Run `node start` or `node server.js` 

## Employee API
### 1. Get details of previous applications

http://localhost:8092/username  
This returns json array of all the leave applications previously submitted. _username_ is the username field from _User_ collection. 

### 2. Submit new leave application 
**POST request URL**  
http://localhost:8092/username  
The request body must contain leave schema as:
```
{
  startdate: String,
  enddate:String,
  leavetype:{type: String, enum :['Earned Leave','Sick Leave','Casual Leave','Maternity Leave']},
  reason:{type:String, default:"Not Specified"},
}
```

  
## Manager API
### 1. Review all the leave applications  
**GET request URL**  
http://localhost:8092/username   
This  request returns all the leave applications in the system.   

### 2. Approve a leave application

**PUT request URL**  
http://localhost:8092/username/leaveId

This request will change the _approvalStatus_ of leave application with _\_id_ as _leaveId_  to true. The default _approvalStatus_ is false. 


#### Authentication 
The api endpoints check for the role of the _username_ to allow access.
