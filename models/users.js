var mongoose= require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
  UserId:String,
  FirstName:String,
  LastName:String,
  EmailAddress:String,
  Address1:String,
  Address2:String,
  City:String,
  State:String,
  PostalCode:String,
  Country:String
});

var users= mongoose.model('users',userSchema);

module.exports=users;
