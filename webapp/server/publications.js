Meteor.publish("allClothing", function () {  
  return Clothing.find({ user_id: this.userId });
});
