Meteor.publish("allClothing", function (user_id) {
  console.log("user_id:", user_id);
  return Clothing.find({ user_id });
});

Meteor.publish("outfits", function () {
  return Outfits.find({
    user_id: this.userId
  });
});

Meteor.publish("outfit", function (outfit_id) {
  let outfit = Outfits.findOne(outfit_id);

  return [
    Outfits.find(outfit_id),
    Clothing.find({
      _id: { $in: outfit.clothing_ids }
    }),
    Comments.find({ outfit_id }),
  ];
});

Meteor.publish("sharedClosets", function () {
  return Meteor.users.find({
    "profile.fullName": { $exists: true }
  });
});
