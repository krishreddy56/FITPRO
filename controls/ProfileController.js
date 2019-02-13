var express=require('express')
var app=express();
var router =module.exports= express.Router();

var bodyParser= require('body-parser');
var urlencodedParser= bodyParser.urlencoded({extended:false});
var UserDB = require('../models/UserDB.js');
var itemDB=require('../models/itemDB')
var offerDB=require('../models/offerDB')
var mongoose= require('mongoose');
var saltHashPassword = require('../models/crypto').saltHashPassword;
var sha512 = require('../models/crypto').sha512;
var { check,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

var user = UserDB.users;
mongoose.connect('mongodb://localhost:27017/fitpro',function(err){
  if (err) throw err;
  console.log("Successfully connected");
})
app.set('view engine', 'ejs');
app.use('/resources', express.static('resources'));

router.get('/myitems',function(req,res,next){

  if(req.session.theUser==undefined){
    req.session.navigate='myitems';
    res.render('loginform',{start:[1]});
}
else{
  var UserId=req.session.theUser.UserId;
    itemDB.getItemsByUserId(UserId)
    .then(function(allItems){
      if(allItems.length!=0){
        res.render('myitems',{allItems:allItems,firstname:req.session.theUser.FirstName});
      }
      else{
        res.render('myitems',{allItems:[],firstname:req.session.theUser.FirstName});
      }
  });
  }
});
router.get('/signup', function (req, res) {
    res.render('signup')
})

router.get('/login', function(req,res,next){
    if(req.session.theUser==undefined){
      res.render('loginform',{start:[1]});
        req.session.save();
    }
  });
router.get('/logout',function(req,res,next){
    req.session.destroy();
    console.log('session ended');
    res.render('index',{start:[]})
});
router.post('/signup', urlencodedParser, [check('Username').not().isEmpty().withMessage('username is required')
    .isAlphanumeric().withMessage('Username contains invalid characters')
    .custom(function (value, { req }) {
        return new Promise(function (resolve, reject) {
            user.findOne({ UserName: req.body.Username }, function (err, data) {
                if (err) {
                    reject(new Error('internal error'))
                }
                else if (Boolean(data)) {
                    reject(new Error('username is already taken try again with new one'))
                }
                resolve(true)
            })
        })
    }).trim(), check('password').not().isEmpty().withMessage('Password cannot be empty')
        .isAlphanumeric().withMessage('password contains invalid characters')
        .isLength({ min: 5 }).withMessage('password should contain atleast 5 characters').trim(),
check('cpassword').custom(function (value, { req }) {
    return new Promise(function (resolve, reject) {
        if (value != req.body.password) {
            reject(new Error('confirm password does not matches with password'))
        }
        resolve(true)
    })
}).trim(),
check('firstName').isAlpha().withMessage('firstname contains invalid characters')
    .isLength({ max: 20 }).withMessage('first name should only contain max of 20 letters').trim(),
check('lastName').isAlpha().withMessage('lastname contains invalid characters')
    .isLength({ max: 20 }).withMessage('Last name should only contain max of 20 letters').trim(),
check('email').isEmail().withMessage('invalid email')
    .custom(function (value, { req }) {
        return new Promise(function (resolve, reject) {
            user.findOne({ EmailAddress: value }, function (err, data) {
                if (err) {
                    reject(new Error('internal error'))
                }
                else if (data) {
                    reject(new Error('Email already in use'))
                }
                resolve(true)
            })
        })
    })
    , check('address1').trim()
        .custom(function (value) {
            return new Promise(function (resolve, reject) {
                if (value) {
                    var addregex = new RegExp("^[A-Za-z0-9'\\.\\-\\s\\,]{1,50}$", 'g');//regex to allow only necessary char for add field
                    var check = addregex.test(value)
                    if (check == true) {
                        resolve(true)
                    }
                    else {
                        reject(new Error('invalid address'))
                    }

                }
                else {
                    resolve(true)
                }
            })
        }),check('address2').trim()
            .custom(function (value) {
                return new Promise(function (resolve, reject) {
                    if (value) {
                        var addregex = new RegExp("^[A-Za-z0-9'\\.\\-\\s\\,]{1,50}$", 'g');//regex to allow only necessary char for add field
                        var check = addregex.test(value)
                        if (check == true) {
                            resolve(true)
                        }
                        else {
                            reject(new Error('invalid address'))
                        }

                    }
                    else {
                        resolve(true)
                    }
                })
            }), check('city').trim()
            .custom(function (value) {
                return new Promise(function (resolve, reject) {
                    if (value) {
                        var cityregex = new RegExp('^[a-zA-Z]+(?:[ -][a-zA-Z]+)*$', 'g')
                        if (cityregex.test(value)) {
                            resolve(true)
                        }
                        else {
                            reject(new Error('invalid city'))
                        }

                    }
                    else {
                        resolve(true)
                    }
                })
            }), check('state').trim()
                .custom(function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value) {
                            var stateregex = new RegExp('^[a-zA-Z ]{1,25}$', 'g')
                            if (stateregex.test(value)) {
                                resolve(true)
                            }
                            else {
                                reject(new Error('invalid state'))
                            }

                        }
                        else {
                            resolve(true)
                        }
                    })
                }), check('country').trim()
                    .custom(function (value) {
                        return new Promise(function (resolve, reject) {
                            if (value) {
                                var countryregex = new RegExp('^[a-zA-Z ]{1,35}$', 'g')
                                if (countryregex.test(value)) {
                                    resolve(true)
                                }
                                else {
                                    reject(new Error('invalid country'))
                                }

                            }
                            else {
                                resolve(true)
                            }
                        })
                    }), check('zipcode').trim()
                        .custom(function (value) {
                            return new Promise(function (resolve, reject) {
                                if (value) {
                                    var zipcoderegex = new RegExp('^[0-9]{1,5}$', 'g')
                                    if (zipcoderegex.test(value)) {
                                        resolve(true)
                                    }
                                    else {
                                        reject(new Error('invalid zipcode'))
                                    }

                                }
                                else {
                                    resolve(true)
                                }
                            })
                        })
]

    , function (req, res, next) {
        var validationerrors = validationResult(req)

        if (!validationerrors.isEmpty()) {
            var allerrors = validationerrors.array();
            delete req.body.password;
            delete req.body.cpassword;
            res.render('signup', { errorsarray: allerrors, data: req.body })
        }
        else {

            var Username = req.body.Username
            var password = req.body.password
            var firstName = req.body.firstName
            var lastName = req.body.lastName
            var EmailAddress = req.body.email
            var Address1 = req.body.address1
            var Address2 = req.body.address2
            var City = req.body.city
            var State = req.body.state
            var PostCode = Number(req.body.zipcode)
            var Country = req.body.country
            var passworddata = saltHashPassword(password)
            var salt = passworddata.salt;
            var hash = passworddata.passwordHash;

            UserDB.addUser(Username, hash, salt, firstName, lastName, EmailAddress, Address1,Address2, City, State, PostCode, Country).then(function(data){
              console.log(data)
              if(data){

              res.redirect('login')
              }
            }).catch(function(err){console.log(err)})

//             var AddUser = UserDB.AddUser;
//             AddUser(newuser).then(function (data) {
// /**after succesful registration user is redirected to a page with login link on it */
//                 res.render('signup', { firstname: data.firstName, register: [1] })
//             }).catch(function (err) {
//                 console.log(err)
//             })
        }
    })
router.get('/categories?:catalogCategory',function(req,res){
  var catalogcategory=req.query.catalogCategory;
  var catregex = RegExp('^[a-zA-Z\\d\\s]{1,20}$','g');
  if(catalogcategory==undefined||(catalogcategory!=undefined && catregex.test(catalogcategory))){
    if(req.session.theUser==undefined){
      itemDB.getAllItems().then(function(cc){
        res.render('categories',{cc:cc,start:[]})
      }).catch(function(err){
        console.error(err);
      })
    }
    else{
      var UserId=req.session.theUser.UserId;
      itemDB.getItemsByNonId(UserId).then(function(cc){
      res.render('categories',{cc:cc,start:[1],firstname:req.session.theUser.FirstName});
      }).catch(function(err){
        console.error(err);
      })
    }
  }
    else{
        if(req.session.theUser==undefined){
        var start=[];
        var Userfname=undefined
        }
        else{
            var start=[1];
            var Userfname=req.session.theUser.firstName
        }
        res.render('categories',{catalogcategory:catalogcategory,error:'invalid category',start:start,firstname:Userfname})
    }
});

router.get('/myswaps',function(req,res,next){
    if(req.session.theUser==undefined){
        req.session.navigate='myswaps';
        res.render('loginform',{start:[1]});
      }
      else{
        var UserId= req.session.theUser.UserId;
        offerDB.getOffersByOffereeId(UserId).then(function(allItems){
          //console.log(allItems);
          if(allItems.length!=0){
        res.render('mySwaps',{allItems:allItems,firstname:req.session.theUser.FirstName,UserId:req.session.theUser.UserId})
          }
          else{
            res.render('mySwaps',{allItems:[],firstname:req.session.theUser.FirstName})
          }
        }).catch(function(err){
          console.log(err)
        })
      }
 })
router.post('/loginform',urlencodedParser,[check('Email').exists().isEmail().normalizeEmail().withMessage('Invalid'),
check('Password').exists().isAlphanumeric().trim()
],function(req,res,next){
  var Email=req.body.Email;
  var Password=req.body.Password;
  var errors = validationResult(req);
if (!errors.isEmpty())  {
loginerrorsarray=errors.array();
console.log(loginerrorsarray)

res.render('loginform',{start:[],loginerrors:loginerrorsarray})

}   else{
  UserDB.users.findOne({ EmailAddress: Email }, function (err, data) {
            if (err) throw err;
            if (data) {
              console.log("Hello")
                var userpassword = sha512(Password, data.salt)
                if (userpassword.passwordHash == data.hash) {
                    console.log(data.EmailAddress + ' logged in')
                    req.session.theUser = data;
                    if (req.session.navigate != undefined) {
                        var navigate = req.session.navigate
                        delete req.session.navigate;
                        res.redirect(navigate)
                    }
                    else {
                        res.render('index', { start: [1], firstname: req.session.theUser.FirstName })
                    }
                }
                else {
                    res.render('loginform', { start:[] })
                }
            }
        })
}
})

router.post('/action*',urlencodedParser,function(req,res,next){


      var theItem=req.query.theItem;
      var offerId=req.body.offerId;
      var action=req.body.action;
      var itemcode= req.body.itemList;
      var itemurl=req.query;
      var UserId=req.session.theUser.UserId
     console.log('requested action: '+action);
     if(action=='update'||action=='Accept'||action=='Reject'||action=='withdrawswap'||action=='delete'||action=='offer'||action=='signout'){
         if(action=='update'){
           itemDB.getItemsByItemCode(itemcode).then(function(doc){
             if(doc[0].status=='pending'){
               res.redirect('mySwaps')
             }
             else{
               res.render('item',{senddata:doc[0],start:[1],msg:[],firstname:req.session.theUser.FirstName,status:doc[0].status});
             }
           })
         }
         else if(action=='Accept'||action=='Reject'||action=='withdrawswap'){
          if(action=='Reject'){
           offerDB.updateOffer(offerId,'rejected',function(err,doc){
             console.log("find "+ doc.toObject())
             if(doc.length!=0){
               console.log('This item has been rejected:' + doc[0].item )
             }
           })
       }
       else if(action=='withdrawswap'){
         offerDB.updateOffer(offerId,'withdrawn',function(err,doc){
           console.log("find "+ doc.toObject())
           if(doc.length!=0){
             console.log('This item has been rejected:' + doc[0].item )
           }
         })
       }
       else if(action=='Accept'){
         offerDB.updateOffer(offerId,'accepted',function(err,doc){
           console.log("find "+ doc.toObject())
           if(doc.length!=0){
             console.log('This item has been rejected:' + doc[0].item )
           }
         })
       }

       res.redirect('myitems')
     }
     else if(action=='delete'){
       offerDB.deleteOffer(UserId,itemcode,function(err,doc){

         console.log('this item has been deleted:')
       })
       res.redirect('myitems')
     }
     else if(action=='offer'){
       var promise1=itemDB.items.find({itemCode:itemcode})
       var promise2=itemDB.items.find({UserId:UserId,status:'available'})
       Promise.all([promise1,promise2]).then(function([itemdetails,swapitemdetails]){
         if(swapitemdetails!=0){
           res.render('swap',{senddata:itemdetails[0],swaplist:swapitemdetails,firstname:req.session.theUser.FirstName,start:[1]})
         }
         else{
           res.render('item',{senddata:itemdetails[0],msg:'There are no items to swap.Please try again',firstname:req.session.theUser.FirstName,start:[1]})
         }
       })
       }
     }

   });
