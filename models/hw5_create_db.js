var MongoClient = require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/fitpro";
var fitpro='fitpro'
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    db.db(fitpro).dropDatabase(function(err,res){
        if(err) throw err;
        console.log(res);
    })
  });
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo=db.db(fitpro)
        var allItems=[{"_id":new ObjectId('5bd901e71cc951191c8ad261'),"UserId":1,"itemCode":"ins1","itemName":'KK',"catalogCategory":'Yoga',"description1":'KK is new yoga instructor to our company. He has experience of 10 years.He is very friendly with his students. He is very dedicated and passionate towards his work.He conducts a fast paced class designed to build heat and strength.',"description2":'For more details contact him at kk@gmail.com',"rating":'5',"imageUrl":'./resources/IMG_2668.jpg',"status":'available'},
        {"_id":new ObjectId('5bda4a621cc951191c8ad269'),"UserId":1,"itemCode":"ins2","itemName":'JC',"catalogCategory":'Yoga',"description1":'JC is a yoga instructor. He conducts session only on weekaday evenings. His class strength is 30.',"description2":'For more details please contact him at jc@fitpro.com',"rating":'3',"imageUrl":'./resources/image2.jpeg',"status":'pending'},
        {"_id":new ObjectId('5bda4ad41cc951191c8ad26a'),"UserId":2,"itemCode":"ins3","itemName":'AKASH',"catalogCategory":'Yoga',"description1":'Akash is a yoga instructor.He teaches breathing techniques to improve flexibility and strength.',"description2":'For more details please contact him at akash@fitpro.com',"rating":'3',"imageUrl":'./resources/IMG_2664.jpg',"status":'pending'},
        {"_id":new ObjectId('5bda4b691cc951191c8ad26b'),"UserId":2,"itemCode":"ins4","itemName":'AKHIL',"catalogCategory":'Cardio',"description1":'Akhil is a cardio instructor.He trains the students to be fit in the process of weight loss or gain.',"description2":'For more details please contact him at akhil@fitpro.com',"rating":'4',"imageUrl":'./resources/user1.png',"status":'available'},
        {"_id":new ObjectId('5bda4bd81cc951191c8ad26c'),"UserId":1,"itemCode":"ins5","itemName":'ANVESH',"catalogCategory":'Cardio',"description1":'Anvesh is a cardio instructor.He is the new instructor in our company. He is so passionate for his work .',"description2":'For more details please contact him at anvesh@fitpro.com',"rating":'3',"imageUrl":'./resources/user1.png',"status":'pending'},
        {"_id":new ObjectId('5bda4c271cc951191c8ad26d'),"UserId":2,"itemCode":"ins6","itemName":'SREENIVAS',"catalogCategory":'Cardio',"description1":'Sreenivas is a cardio instructor.He schedules aerobics classes on weekday evenings.',"description2":'For more details please contact him at sreenivas@fitpro.com',"rating":'3',"imageUrl":'./resources/image1.jpeg',"status":'pending'}
      ]
      var allUsers=[{"_id":new ObjectId('5bd9018a1cc951191c8ad25f'),"UserId":1,"UserName":'admin',"hash":"9a7b958b64b192b89c6206de0c2df9ffcf9a11cfcc0109d12cbaecb6cd4c7e6dc36350ef7ca3ac83c5909f0bc5677420f0dd8796e2d01334da8154a420bfad9a","salt":"4d54288f1303e0ab","FirstName":"tester","LastName":"quality","EmailAddress":"tester@gmail.com","Address1":"151 stone creek dr","Address2":"Apt D","City":"charlotte","State":"NC","PostalCode":"28241","Country":"USA"},
    {"_id":new ObjectId('5bd9075db975bc191c820a7b'),"UserId":2,"UserName":'developer',"hash":"ce59122336cd15ac295e25c46bce09baed5b8b3cfadbe099c5158fcccc129ddf85beaaa3a9df6800ff5b65162183cdc0ef40f625e9d297221f99188f2dc62720","salt":"211219ddfccc99f7","FirstName":"developer","LastName":"js","EmailAddress":"developer@gmail.com","Address1":"220 rocky drive","Address2":"Apt A","City":"Raleigh","State":"NC","PostalCode":"24351","Country":"USA"}];
    var allOffers=[{"_id":new ObjectId("5bd903701cc951191c8ad262"),"offerId":1,"offeror_id":2,"offeror_itemCode":"ins3","offeree_id":1,"offeree_itemCode":"ins2","offer_status":'pending'},
  {"_id":new ObjectId("5beb6f6e2e7bb83570e1acd5"),"offerId":2,"offeror_id":1,"offeror_itemCode":"ins5","offeree_id":2,"offeree_itemCode":"ins6","offer_status":'pending'}];
  var allCounters=[
        {"_id":new ObjectId('5bebd9242e7bb83570e1acd6'),"field_id":"User_Id","nextId":2},
        {"_id":new ObjectId('5bebd94a2e7bb83570e1acd7'),"field_id":"Offer_Id","nextId":2}]

  dbo.collection("items").insertMany(allItems,function(err,res){
        if(err) throw err;
        console.log("items inserted:"+res.insertedCount);

    })
    dbo.collection("users").insertMany(allUsers,function(err,res){
        if(err) throw err;
        console.log("users inserted:"+res.insertedCount);

    })
    dbo.collection("offers").insertMany(allOffers,function(err,res){
        if(err) throw err;
        console.log("offers inserted:"+res.insertedCount);

    })
    dbo.collection('counters').insertMany(allCounters,function(err,res){
        if(err) throw err;
        console.log('counter inserted:'+res.insertedCount)

    })
});
