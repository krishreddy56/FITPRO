class UserProfile{
  constructor(UserId, UserItems){
    this.UserId= UserId;
    this.UserItems=UserItems;
  }
  removeUserItem(ItemID){
    this.ItemID=ItemID;
    var ItemIdobj=[];
    for (i=0;i<this.UserItems.length;i++){
      ItemIdobj.push(this.UserItems[i].Item);
    }
    if(ItemIdobj.includes(ItemID)){
      for (i=0;i<this.UserItems.length;i++){
        if(this.UserItems[i].Item==ItemID){
          this.UserItems.splice(i,1);
          return 'the following'+ ItemID +' is removed';
        }
      }
    }
    else{
      return 'there are no such '+ ItemID+' in profile';
    }

  }
  getUserItems(){
    return this.UserItems;

  }
  emptyProfile(){
     delete this.UserId;
     delete this.UserItems;
  }
}

module.exports=UserProfile;
