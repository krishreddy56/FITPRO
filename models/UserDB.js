var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/fitpro')
var Schema=mongoose.Schema;
var userSchema=new Schema({
  _id:{type:Schema.Types.ObjectId,auto:true},
  UserId:{type:Number,unique:true,required:true},
  UserName:{type:String,unique:true,required:true},
  
  hash:{type:String,required:true},
  salt:{type:String,required:true},
  FirstName:{type:String,required:true},
  LastName:{type:String,required:true},
  EmailAddress:{type:String,required:true},
  Address1:{type:String,required:true},
  Address2:String,
  City:{type:String,required:true},
  State:{type:String,required:true},
  PostalCode:{type:String,required:true},
  Country:{type:String,required:true}
});


var counterSchema=new Schema({
  field_id:{type:String},
  nextId:{type:Number}
})

var users= mongoose.model('users',userSchema);
var counters= mongoose.model('counters',counterSchema)

// var addUser=function(Username,hash,salt,firstName,lastName,EmailAddress,Address1,Address2,City,State,PostCode,Country){
//     var user={
//         Username:Username,
//         hash:hash,
//         salt:salt,
//         FirstName:firstName,
//         LastName:lastName,
//         EmailAddress:EmailAddress,
//         Address1:Address1,
//         Address2:Address2,
//         City:City,
//         State:State,
//         PostalCode:PostCode,
//         Country:Country
//     }
//
//    return user;
// }

// var AddUser=function(NewUser){
//     return new Promise(function(resolve,reject){
//         counters.findByIdAndUpdate({field_id:'counters'}, {$inc: { nextId: 1} }, {new: true, upsert: true}).then(function(count) {
//             NewUser.UserId = count.nextId;
//             var newuser=new users(NewUser);
//
//                 newuser.save(function(err,res){
//                     if (err) {7
//                         counters.findByIdAndUpdate({field_id:'counters'}, {$inc: { seq: -1} }, {new: true, upsert: true}).then(function(count) {
//                         })
//                         .catch(function(error) {
//                         console.error("counter error-> : "+error);
//                         throw error;
//                         });
//                         console.log('error from add user: '+ err)
//                     }
//                     else{
//                         resolve(res)
//                         console.log('newuser with userID: '+res.UserId+' and username: '+NewUser.Username+' is saved')
//
//
//
//                     }
//
//                 })
//         }).catch(function(error) {
//             console.error("counter error-> : "+error);
//             throw error;
//         });
//
//     })
//
//
//
// }
var addUser=function(UserName,hash,salt,FirstName,LastName,EmailAddress,Address1,Address2,City,State,PostalCode,Country){
  return new Promise(function(resolve,reject){
    counters.findOneAndUpdate({field_id:'User_Id'},{ $inc: { nextId: 1 } },{new:true}).then(function(data){
      console.log("hello"+ data + UserName);
        var newUser=new users({
        UserId:data.nextId,
        UserName:UserName,
        hash:hash,
        salt:salt,
        FirstName:FirstName,
        LastName:LastName,
        EmailAddress:EmailAddress,
        Address1:Address1,
        Address2:Address2,
        City:City,
        State:State,
        PostalCode:PostalCode,
        Country:Country
      })
      newUser.save().then(function(doc){
        console.log('new user with userid: '+ doc.UserId)
        resolve(doc)
      })
      .catch(function(err){

        return reject(err);
      })
    }).catch(function(err){
      console.log(err);
    });

  });
}
//addUser('sakethffd','fdsafsdf','abc','def','abc@gmail.com','sf','fsf','sfs','asf','456789','dfds')
var getAllUsers=function(){
  return new Promise(function(resolve,reject){
    users.find({}).then(function(doc){
      resolve(doc);
      console.log(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}
var getUsersById=function(UserId){
  return new Promise(function(resolve,reject){
    users.findOne({UserId}).then(function(doc){
      console.log(doc);
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}
var validateUser=function(Email,Password){
  return new Promise(function(resolve,reject){
    users.findOne({EmailAddress:Email,Password:Password}).then(function(doc){
      console.log(doc);
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}








module.exports.users=users;
module.exports.addUser=addUser;
// module.exports.AddUser=AddUser;
module.exports.getAllUsers=getAllUsers;
module.exports.getUsersById=getUsersById;
module.exports.validateUser=validateUser;
module.exports.counters=counters;
