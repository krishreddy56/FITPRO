var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/fitpro')
var Schema=mongoose.Schema;

var offers=require('./offerDB').offers
var items=require('./itemDB').items;
var userFeedbackSchema=new Schema({
    offerId:{type:String,require:true,ref:'offer',field:'offerId'},
    UserId1:{type:Number,require:true,ref:'user', field:'UserId'},
    UserId2:{type:Number,require:true,ref:'user', field:'UserId'},
    rating:{type:Number,require:true}
},{ versionKey: false,collection:'user-userfeedback',toObject: { virtuals: true }})

userFeedbackSchema.index({offerId:1,UserId1:1},{unique:true})

var itemFeedbackSchema=new Schema({
    itemCode:{type:String,required:true,ref:'items',field:'itemCode'},
    UserId:{type:Number,required:true,ref:'users', field:'UserId'},
    rating:{type:Number,required:true}
},{ versionKey: false,collection:'user-itemfeedback',toObject: { virtuals: true }})

itemFeedbackSchema.index({itemcode:1,UserId:1},{unique:true})
// itemFeedbackSchema.virtual({
//     ref:'offer',
//     localField:'offerId',
//     foreignField:'offerId',
//     justOne: true
// })

var userFeedback=mongoose.model('userFeedback',userFeedbackSchema)
var itemFeedback=mongoose.model('itemFeedback',itemFeedbackSchema)

var addOfferFeedback=function(offerId,UserId1,UserId2,rating){
    var newOffer= new userFeedback({
        offerId:offerId,
        UserId1:UserId1,
        UserId2:UserId2,
        rating:rating
    })
    offers.find({offerId:offerId,status:'swapped',$or:[{offerorId:UserId1},{offereeId:UserId1}]},function(err,offer){
        if(offer.length!=0){
            newOffer.save(function(err,res){
                if(err){
                    console.log('this error is user feedback: '+err)
                }
                else{
                    console.log(res);
                }

            })
        }
        else{
            console.log('cannot find ')
        }
    })

}

var addItemFeedback=function(itemCode,UserId,rating){
    var newItemFeedback=new itemFeedback({
        itemCode:itemCode,
        UserId:UserId,
        rating:rating
    })

    items.find({UserId:UserId,itemCode:itemCode},function(err,data){
        if(err) throw err;
        if(data.length!=0){
            newItemFeedback.save(function(err,res){
                if(err){
                    itemFeedback.findOneAndUpdate({UserId:newItemFeedback.UserId,itemCode:newItemFeedback.itemCode},{rating:newItemFeedback.rating},{new:true},function(err,data){
                        if(err) throw err;
                        console.log('  the new rating for '+ data.itemcode  + 'is' +'data.rating')
                    })
                    //console.log('error from add item feedback'+err)
                }
                else{
                    console.log(res)
                }
            })
        }
        else{
            console.log('Sorry you have no items to rate ')
        }
    })
}
//addItemFeedback('ins2',1,4)
