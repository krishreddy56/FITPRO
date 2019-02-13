var express= require('express');
var app = express();
var allItems = require('../models/itemDB.js');
//var allItems2=require('../models/catalog.js');
var l= require('../models/itemDB.js');
var db=require('../models/itemDB.js');
var allItems = require('../models/UserDB.js');
var allUsers= require('../models/UserDB.js');
var itemDB=require('../models/itemDB')
var UserDB=require('../models/UserDB')
var offerDB=require('../models/offerDB')
var mongoose=require('mongoose');
var session=require('express-session')
var { check ,validationResult } = require('express-validator/check');
app.use(session({secret:"krishnakanth",resave: false,saveUninitialized: true}));

app.set('view engine', 'ejs');
app.set('views','../views');
app.use('/resources', express.static('../resources'));

app.get('/home', function(req,res){
  if(req.session.theUser==undefined){
        res.render('index',{start:[]})
        }
        else{
            res.render('index',{start:[1],firstname:req.session.theUser.FirstName})
        }
});
app.get('/contactus', function(req,res){
  if(req.session.theUser==undefined){
        res.render('contactus',{start:[]})
        }
        else{
            res.render('contactus',{start:[1],firstname:req.session.theUser.FirstName})
        }
});

// app.get('/swap', function(req,res){
//   res.render('swap');
// });
// app.get('/mySwaps', function(req,res){
//   res.render('mySwaps');
// });
app.use(require('./ProfileController.js'))
app.get('/about', function(req,res){
  if(req.session.theUser==undefined){
        res.render('about',{start:[]})
        }
        else{
            res.render('about',{start:[1],firstname:req.session.theUser.FirstName})
        }
});
app.get('/item?:itemurl', check('itemCode','invalid itemcode').isAlphanumeric().trim(),function(req,res){
  var itemurl=req.query;
  // var allItems=itemDB.getallitems(itemDB.allItems);
  // var itemcode=itemDB.itemcodes;
  // var getitem=itemDB.getitem;
  // var getallitems=itemDB.getallitems;
  // var itemcodeobj=itemcode(allItems);
  // var getitemsbycategory=itemDB.getitemsbycategory;
  // var cc=getitemsbycategory(itemDB.allItems,itemurl.catalogCategory);
  // var keys=Object.keys(itemurl);
  // console.log(keys);
  var errors=validationResult(req)
    if(!errors.isEmpty()){
    var errorsarray=errors.array();

    if(req.session.theUser==undefined){
        var session=[];
        var Userfname=undefined;
    }
    else{
        var session=[1];
        var Userfname=req.session.theUser.firstName;
    }
    res.render('item',{errors:errorsarray,start:session,firstname:Userfname})
  }
  else{
  itemDB.getItemsByItemCode(itemurl.itemCode).then(function(doc){
    var senddata=doc[0];
    var status=doc[0];
  if(req.session.theUser!=undefined){

    res.render('item',{senddata:senddata,start:[1],msg:[],firstname:req.session.theUser.FirstName,status:status});
  }
  else{
    res.render('item',{senddata:senddata,start:[],msg:[],status:status});
  }

})
}
  // if(keys=='itemCode'){
  //     if(req.session.theUser!=undefined){
  //         var useritemcodes=UserDB.useritemcodes(req.session.currentProfile.UserItems);
  //         if(itemcodeobj.includes(itemurl.itemCode)){
  //             var senddata=getitem(itemurl.itemCode);
  //             var status;
  //             if (useritemcodes.includes(itemurl.itemCode)){
  //                 for(var i=0;i<req.session.currentProfile.UserItems.length;i++){
  //                     if(req.session.currentProfile.UserItems[i].Item.itemCode==itemurl.itemCode){
  //                        senddata= req.session.currentProfile.UserItems[i].Item;
  //                        status=req.session.currentProfile.UserItems[i].Status;
  //                        console.log(senddata.itemCode+"="+status)
  //                     }
  //                 }
  //             }
  //             else{
  //                 senddata=senddata;
  //                 status='unknown';
  //             }
  //             res.render('item',{senddata:senddata,start:[1],msg:[],firstname:req.session.theUser.FirstName,status:status});
  //         }
  //         else{
  //
  //             res.render('categories',{cc,start:[1],firstname:req.session.theUser.FirstName});
  //         }
  //     }
  //     else{
  //         if(itemcodeobj.includes(itemurl.itemCode)){
  //             var senddata=getitem(itemurl.itemCode);
  //             res.render('item',{senddata,start:[],msg:[]});
  //         }
  //         else{
  //
  //             res.render('categories',{cc,start:[]});
  //         }
  //     }
  // }
  // else{
  //   console.log("hello");
  //     res.render('categories',{cc,start:[]});
  //    // res.send('no information available or requested');
  // }

 });
//   for(i=0;i<l.allItems.length;i++){
//  cd.push(l.allItems[i].itemCode);
// }
//   if(cd.includes(itemCode)){
//     for(i=0;i<l.allItems.length;i++){
//
//        if(itemCode==l.allItems[i].itemCode){
//         var info={itemCode:l.allItems[i].itemCode,imageUrl:l.allItems[i].imageUrl,itemName:l.allItems[i].itemName,description1:l.allItems[i].description1,
//           description2:l.allItems[i].description2}
//         res.render('item',{info:info,start:[1]});
//       }
// }
// }
// else {
//   var  cc=db.allItems;
//   res.render('categories',{cc});
//   }

app.get('/swap?:swapurl',function(req,res){
    var swapurl= req.query;
    var allItems=itemDB.getallitems(itemDB.allItems);
   for(var i=0;i<allItems.length;i++){
        if(swapurl.itemCode==allItems[i].itemCode){
            var senddata=allItems[i];
            res.render('swap',{senddata});
        }
    }
  });
// app.get('/categories', function(req,res){
// var allItems=db.allItems;
// var getallitems=db.getallitems(allItems);
// var qs=req.query;
// var cc=[];
// if(qs.catalogCategory=='Yoga'||qs.catalogCategory=='Cardio'){
//
// for(var i=0;i<allItems.length;i++){
//     if(qs.catalogCategory==allItems[i].catalogCategory){
//       cc.push(allItems[i]);
//
//     }
// }
// }
// else{
//   cc=allItems;
// }
// res.render('categories',{cc});
// });
app.use(function(req,res,next ){
  res.status(404).send("Please enter the valid URL.You can try appending /home")
});
app.listen(3000);
