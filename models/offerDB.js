var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/fitpro')
var Schema=mongoose.Schema;
var items=require('./itemDB').items
var counters=require('./UserDB').counters


var offerSchema=new Schema({
  offerId:{type:String},
  offeror_id:{type:String},
  offeror_itemCode:{type:String,ref:'items'},
  offeree_id:{type:String},
  offeree_itemCode:String,
  offer_status:String
},{toObject:{virtuals:true}});


offerSchema.virtual('offerdetail',{
  ref:'items',
  localField:'offeror_itemCode',
  foreignField:'itemCode',
  justOne:true
})
offerSchema.virtual('offerdetails',{
  ref:'items',
  localField:'offeree_itemCode',
  foreignField:'itemCode',
  justOne:true
})
var offers= mongoose.model('offers',offerSchema);

var addOffer=function(offeror_id,offeror_itemCode,offeree_id,offeree_itemCode,offer_status){
  return new Promise(function(resolve,reject){
    counters.findOneAndUpdate({field_id:'Offer_Id'},{ $inc: { nextId: 1 } },{new:true}).then(function(data){

        var newOffer=new offers({
          offerId:data.nextId,
          offeror_id:offeror_id,
          offeror_itemCode:offeror_itemCode,
          offeree_id:offeree_id,
          offeree_itemCode:offeree_itemCode,
          offer_status:offer_status,
        });
      newOffer.save().then(function(doc){
        console.log('new offer with offerid: '+ doc.offerId)
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
//addOffer('res','fdf','sfsd','df','ffsaf');
var updateOffer=function(offerId,statusType){
  if(statusType=='accepted'){
    var itemstatus={'status':'swapped'}
    var offerstatus={'offer_status':'swapped'}
  }
    else if(statusType=='rejected'){
      var itemstatus={'status':'available'}
      var offerstatus={'offer_status':'rejected'}
    }
    else if(statusType=='withdrawn'){
      var itemstatus={'status':'available'}
      var offerstatus={'offer_status':'withdrawn'}
  }

offers.find({offerId:offerId}).then(function(doc){
  console.log("Hello ")
  var query={$or:[{itemCode:doc[0].offeree_itemCode},{itemCode:doc[0].offeror_itemCode}]}
  items.update(query,itemstatus,{'multi':true},function(err,doc){
    if(err) throw err;
    //console.log(doc);
  })
  offers.findOneAndUpdate({offerId:offerId},offerstatus,{new:true},function(err,doc){
    console.log("issue")
    if(err) throw err;
  })
})
}
var deleteOffer=function(UserId,itemCode){
  items.findOneAndRemove({UserId:UserId,itemCode:itemCode}).then(function(item){
  if(item){
  }
  })


  var query={$or:[{offeree_id:UserId,offeree_itemCode:itemCode},{offeror_id:UserId,offeror_itemCode:itemCode}]}
  offers.findOneAndRemove(query).then(function(offer){
    if(offer){
      if(offer.offeror_itemCode==itemCode){
        items.findOneAndUpdate({itemCode:offer.offeree_itemCode},{status:'available'}).then(function(doc){

        })
      }
        else{
          items.findOneAndUpdate({itemCode:offer.offeror_itemCode},{status:'available'}).then(function(doc){

          })
        }
      }
    })
  }
 var getOffersByOffereeId=function(UserId){
  return new Promise(function(resolve,reject){
offers.find({offer_status:'pending'}).populate('offerdetail').populate('offerdetails').then(function(doc){
  resolve(doc)

}).catch(function(err){
  console.log(err)
})
})
}

var getOffersByOfferId=function(offerId){
  return new Promise(function(resolve,reject){
offers.find(offerId).then(function(doc){
  resolve(doc)
}).catch(function(err){
  console.log(err)
})
})
}

module.exports.offers=offers;
module.exports.getOffersByOffereeId=getOffersByOffereeId
module.exports.addOffer=addOffer;
module.exports.updateOffer=updateOffer;
module.exports.getOffersByOfferId=getOffersByOfferId;
module.exports.deleteOffer=deleteOffer;
