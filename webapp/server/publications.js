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

Meteor.publish("literallyAllClothing", function () {
  return Clothing.find({}, {
    fields: {
      type: 1,
      image_id: 1,
    }
  });
});

Meteor.publish("sharedClosets", function () {
  return Meteor.users.find({
    "profile.fullName": { $exists: true }
  });
});

Meteor.publish("unseenNotifications", function () {
  Counts.publish(this, "unseen-notifications", Notifications.find({
    user_id: this.userId,
    seen: false
  }));

  return [];
});

Meteor.publish("notifications", function (limit = 8) {
  return Notifications.find({
    user_id: this.userId
  }, {
    sort: { date_created: -1 },
    limit,
  });
});
