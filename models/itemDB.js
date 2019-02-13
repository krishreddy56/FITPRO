var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/fitpro')
var Schema=mongoose.Schema;
var itemSchema=new Schema({
  UserId:{type:Number},
  itemCode:String,
  itemName:String,
  catalogCategory:String,
  description1:String,
  description2:String,
  rating:String,
  imageUrl:String,
  status:String
});
var items= mongoose.model('items',itemSchema);
var getAllItems=function(){
  return new Promise(function(resolve,reject){
    items.find({}).then(function(doc){
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}

var getItemsByNonId=function(UserId){
  return new Promise(function(resolve,reject){
    items.find({UserId:{$ne:UserId}}).then(function(doc){
      //console.log(doc);
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}
var getItemsByUserId=function(UserId){
  return new Promise(function(resolve,reject){
    items.find({UserId:{$eq:UserId}}).then(function(doc){
      //console.log(doc);
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}
var getItemsByItemCode=function(itemCode){
  return new Promise(function(resolve,reject){
    items.find({itemCode}).then(function(doc){
      //console.log(doc);
      resolve(doc);
    }).catch(function(err){
      return reject(err);
    })
  });
}
var addItem=function(itemCode,itemName,catalogCategory,description1,description2,imageUrl){
  return new Promise(function(resolve,reject){
    var newItem=new items({
      itemCode:itemCode,
      itemName:itemName,
      catalogCategory:catalogCategory,
      description1:description1,
      description2:description2,
      imageUrl:imageUrl
    });
    newItem.save().then(function(doc){
      //console.log(doc);
      resolve(doc)
    })
    .catch(function(err){
      return reject(err);
    })
  });
}

module.exports.items=items;
module.exports.addItem=addItem;
module.exports.getAllItems=getAllItems;
module.exports.getItemsByItemCode=getItemsByItemCode;
module.exports.getItemsByNonId=getItemsByNonId;
module.exports.getItemsByUserId=getItemsByUserId;
