class User{
  constructor(UserId, FirstName, LastName, EmailAddress,Address1, Address2, City, State, PostalCode, Country){
  this.UserId=UserId;
  this.FirstName=FirstName;
  this.LastName=LastName;
  this.EmailAddress=EmailAddress;
  this.Address1=Address1;
  this.Address2=Address2;
  this.City=City;
  this.State=State;
  this.PostalCode=PostalCode;
  this.Country=Country;
}
};

module.exports=User;
